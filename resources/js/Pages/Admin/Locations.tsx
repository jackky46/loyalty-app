import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

// Leaflet imports - dynamic import to avoid SSR issues
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface Location {
    id: number;
    name: string;
    address: string;
    phone: string | null;
    city: string;
    latitude: number | null;
    longitude: number | null;
    is_active: boolean;
    employees_count?: number;
}

interface Props {
    locations: Location[];
}

// Map click handler component
function LocationMarker({ position, setPosition }: {
    position: [number, number];
    setPosition: (pos: [number, number]) => void
}) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

export default function Locations({ locations: initialLocations }: Props) {
    const [locations, setLocations] = useState(initialLocations);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapPosition, setMapPosition] = useState<[number, number]>([-6.2088, 106.8456]); // Jakarta default
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        city: '',
        latitude: '',
        longitude: '',
    });

    const handleAdd = () => {
        setEditingLocation(null);
        setFormData({ name: '', address: '', phone: '', city: '', latitude: '', longitude: '' });
        setMapPosition([-6.2088, 106.8456]);
        setShowModal(true);
    };

    const handleEdit = (loc: Location) => {
        setEditingLocation(loc);
        setFormData({
            name: loc.name,
            address: loc.address,
            phone: loc.phone || '',
            city: loc.city || '',
            latitude: loc.latitude?.toString() || '',
            longitude: loc.longitude?.toString() || '',
        });
        if (loc.latitude && loc.longitude) {
            setMapPosition([loc.latitude, loc.longitude]);
        }
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            ...formData,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        };

        if (editingLocation) {
            router.put(`/admin/locations/${editingLocation.id}`, data, {
                onSuccess: () => setShowModal(false),
                onFinish: () => setLoading(false),
            });
        } else {
            router.post('/admin/locations', data, {
                onSuccess: () => setShowModal(false),
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this location?')) return;
        router.delete(`/admin/locations/${id}`);
    };

    const handleMapPositionChange = (pos: [number, number]) => {
        setMapPosition(pos);
        setFormData({
            ...formData,
            latitude: pos[0].toFixed(6),
            longitude: pos[1].toFixed(6),
        });
    };

    const openGoogleMaps = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    return (
        <AdminLayout title="Locations">
            {/* Add Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Location</span>
                </button>
            </div>

            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((loc) => (
                    <div key={loc.id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{loc.name}</h3>
                                    <p className="text-xs text-gray-500">{loc.city}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${loc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {loc.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{loc.address}</p>
                        {loc.phone && <p className="text-sm text-gray-500 mb-3">📞 {loc.phone}</p>}

                        {loc.latitude && loc.longitude && (
                            <button
                                onClick={() => openGoogleMaps(Number(loc.latitude), Number(loc.longitude))}
                                className="text-xs text-emerald-600 hover:text-emerald-700 mb-3 flex items-center space-x-1"
                            >
                                <span>📍</span>
                                <span className="underline">{Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        )}

                        <div className="flex gap-2 pt-3 border-t">
                            <button
                                onClick={() => handleEdit(loc)}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(loc.id)}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {locations.length === 0 && (
                <div className="bg-white rounded-xl p-12 shadow-md text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-gray-500">No locations yet. Add your first location!</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full my-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingLocation ? 'Edit Location' : 'Add Location'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    rows={2}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Map Section */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Location on Map
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowMap(!showMap)}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        {showMap ? 'Hide Map' : 'Show Map'}
                                    </button>
                                </div>

                                {showMap && (
                                    <div className="h-64 rounded-lg overflow-hidden border border-gray-300 mb-3">
                                        <MapContainer
                                            center={mapPosition}
                                            zoom={13}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationMarker
                                                position={mapPosition}
                                                setPosition={handleMapPositionChange}
                                            />
                                        </MapContainer>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 mb-2">
                                    {showMap ? 'Click on the map to select location' : 'Or enter coordinates manually:'}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                                        <input
                                            type="text"
                                            value={formData.latitude}
                                            onChange={(e) => {
                                                setFormData({ ...formData, latitude: e.target.value });
                                                if (e.target.value && formData.longitude) {
                                                    const lat = parseFloat(e.target.value);
                                                    const lng = parseFloat(formData.longitude);
                                                    if (!isNaN(lat) && !isNaN(lng)) {
                                                        setMapPosition([lat, lng]);
                                                    }
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                                            placeholder="-6.200000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                                        <input
                                            type="text"
                                            value={formData.longitude}
                                            onChange={(e) => {
                                                setFormData({ ...formData, longitude: e.target.value });
                                                if (formData.latitude && e.target.value) {
                                                    const lat = parseFloat(formData.latitude);
                                                    const lng = parseFloat(e.target.value);
                                                    if (!isNaN(lat) && !isNaN(lng)) {
                                                        setMapPosition([lat, lng]);
                                                    }
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                                            placeholder="106.800000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    {loading ? 'Saving...' : editingLocation ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
