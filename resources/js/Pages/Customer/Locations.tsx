import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState, useRef } from 'react';

// Leaflet imports
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
    phone?: string;
    city: string;
    latitude?: number;
    longitude?: number;
    operating_hours?: string;
}

interface Props {
    locations: Location[];
}

// Component to handle map fly animation
function FlyToLocation({ position }: { position: [number, number] | null }) {
    const map = useMap();

    if (position) {
        map.flyTo(position, 16, {
            duration: 1.5
        });
    }

    return null;
}

export default function Locations({ locations }: Props) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);

    // Get center from first location with coordinates, or default to Jakarta
    const getMapCenter = (): [number, number] => {
        const locWithCoords = locations.find(l => l.latitude && l.longitude);
        if (locWithCoords && locWithCoords.latitude && locWithCoords.longitude) {
            return [locWithCoords.latitude, locWithCoords.longitude];
        }
        return [-6.2088, 106.8456]; // Jakarta default
    };

    const handleLocationClick = (location: Location) => {
        setSelectedLocation(location);
        // If has coordinates, fly to location on map
        if (location.latitude && location.longitude) {
            setFlyToPosition([location.latitude, location.longitude]);
        }
    };

    const openGoogleMaps = (e: React.MouseEvent, location: Location) => {
        e.stopPropagation(); // Prevent card click
        if (location.latitude && location.longitude) {
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
                '_blank'
            );
        }
    };

    const parseOperatingHours = (hours?: string) => {
        if (!hours) return null;
        try {
            return JSON.parse(hours);
        } catch {
            return null;
        }
    };

    const locationsWithCoords = locations.filter(l => l.latitude && l.longitude);

    return (
        <CustomerLayout title="Lokasi Toko" showBack activeNav="locations">
            {/* Map View */}
            {locationsWithCoords.length > 0 && (
                <div className="h-64 rounded-xl overflow-hidden shadow-lg mb-4 relative z-0">
                    <MapContainer
                        center={getMapCenter()}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FlyToLocation position={flyToPosition} />
                        {locationsWithCoords.map((location) => (
                            <Marker
                                key={location.id}
                                position={[location.latitude!, location.longitude!]}
                                icon={defaultIcon}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        <strong>{location.name}</strong>
                                        <br />
                                        {location.address}
                                        {location.phone && (
                                            <>
                                                <br />
                                                📞 {location.phone}
                                            </>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

            {locationsWithCoords.length === 0 && (
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-xl mb-4">
                    <div className="text-center">
                        <span className="text-4xl">📍</span>
                        <h2 className="text-lg font-bold mt-2">Temukan Mixue Terdekat</h2>
                        <p className="text-sm opacity-90 mt-1">
                            Tap lokasi untuk melihat di peta
                        </p>
                    </div>
                </div>
            )}

            {/* Locations List */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                    Semua Lokasi ({locations.length})
                </h2>

                {locations.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-md">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600">Belum ada lokasi toko tersedia</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {locations.map((location) => {
                            const hours = parseOperatingHours(location.operating_hours);
                            const isSelected = selectedLocation?.id === location.id;

                            return (
                                <div
                                    key={location.id}
                                    className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 ${isSelected ? 'border-red-500' : 'border-transparent'
                                        }`}
                                    onClick={() => handleLocationClick(location)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-red-500' : 'bg-red-100'
                                            }`}>
                                            <svg className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-1">
                                                {location.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {location.address}
                                            </p>

                                            {location.phone && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{location.phone}</span>
                                                </div>
                                            )}

                                            {hours?.mon && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{hours.mon}</span>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-2 mt-3">
                                                {location.latitude && location.longitude ? (
                                                    <>
                                                        <span className="text-xs text-green-600">
                                                            📍 Tap untuk lihat di peta
                                                        </span>
                                                        <button
                                                            onClick={(e) => openGoogleMaps(e, location)}
                                                            className="ml-auto bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            <span>Google Maps</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-yellow-600">
                                                        ⚠️ Koordinat belum diatur
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
