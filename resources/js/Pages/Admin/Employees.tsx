import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Employee {
    id: number;
    position: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        is_active: boolean;
    };
    location: {
        id: number;
        name: string;
    } | null;
}

interface Location {
    id: number;
    name: string;
}

interface Props {
    employees: Employee[];
    locations: Location[];
}

export default function Employees({ employees: initialEmployees, locations }: Props) {
    const [employees, setEmployees] = useState(initialEmployees);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CASHIER',
        location_id: '',
    });

    const filteredEmployees = employees.filter((e) =>
        e.user.name.toLowerCase().includes(search.toLowerCase()) ||
        e.user.email.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'CASHIER',
            location_id: '',
        });
        setShowModal(true);
    };

    const handleEdit = (emp: Employee) => {
        setEditingEmployee(emp);
        setFormData({
            name: emp.user.name,
            email: emp.user.email,
            password: '',
            role: emp.user.role,
            location_id: emp.location?.id.toString() || '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingEmployee) {
            router.put(`/admin/employees/${editingEmployee.id}`, {
                location_id: formData.location_id || null,
                password: formData.password || null,
            }, {
                onSuccess: () => setShowModal(false),
                onFinish: () => setLoading(false),
            });
        } else {
            router.post('/admin/employees', formData, {
                onSuccess: () => setShowModal(false),
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this employee?')) return;
        router.delete(`/admin/employees/${id}`);
    };

    const toggleActive = (userId: number, currentStatus: boolean) => {
        if (!confirm(`${currentStatus ? 'Deactivate' : 'Activate'} this employee?`)) return;
        router.post('/admin/employees/toggle-active', {
            user_id: userId,
            is_active: !currentStatus,
        });
    };

    return (
        <AdminLayout title="Employee Management">
            {/* Search and Add */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 bg-white rounded-xl p-4 shadow-md">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari karyawan..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-4 shadow-md mb-4">
                <p className="text-sm text-gray-600">
                    Total: <span className="font-bold text-gray-800">{filteredEmployees.length}</span> employees
                </p>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
                {filteredEmployees.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{emp.user.name}</p>
                                    <p className="text-xs text-gray-500">{emp.user.email}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${emp.user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {emp.user.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-t border-b mb-3">
                            <div>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${emp.user.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {emp.user.role}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {emp.location?.name || 'Unassigned'}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(emp)}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => toggleActive(emp.user.id, emp.user.is_active)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${emp.user.is_active
                                        ? 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                                        : 'bg-green-50 hover:bg-green-100 text-green-600'
                                    }`}
                            >
                                {emp.user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleDelete(emp.id)}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{emp.user.name}</p>
                                                <p className="text-xs text-gray-500">{emp.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${emp.user.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {emp.user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {emp.location?.name || 'Unassigned'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${emp.user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {emp.user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(emp)}
                                            className="inline-flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(emp.id)}
                                            className="inline-flex items-center px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                        </h2>

                        {editingEmployee && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-800">{editingEmployee.user.name}</p>
                                <p className="text-sm text-gray-500">{editingEmployee.user.email}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingEmployee && (
                                <>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            required
                                        >
                                            <option value="CASHIER">Cashier</option>
                                            <option value="MANAGER">Manager</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <select
                                    value={formData.location_id}
                                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">No location</option>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editingEmployee ? 'Reset Password' : 'Password *'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder={editingEmployee ? 'Leave blank to keep current' : 'Min 6 characters'}
                                    minLength={editingEmployee ? 0 : 6}
                                    required={!editingEmployee}
                                />
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
                                    {loading ? 'Saving...' : editingEmployee ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
