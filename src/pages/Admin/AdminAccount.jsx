import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../../config/axios';
import loadingGif from '@/assets/icons/loading.gif';

const AdminAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editAccount, setEditAccount] = useState({ fullName: '', email: '', roleId: '1' });
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');

  const fetchAccounts = () => {
    setLoading(true);
    api.get('/users', { params: { search } })
      .then(res => setAccounts(res.data.items || res.data || []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts();
  }, [search]);

  // XÓA các state và hàm liên quan đến thêm tài khoản
  // XÓA: adding, setAdding, newAccount, setNewAccount, handleAdd, handleCreate
  // XÓA UI: nút 'Thêm tài khoản', phần render thêm tài khoản (adding && ...)

  const SECRET_KEY = "trideptraivcl"; // Secret key do backend cung cấp
  // Thử các format khác nhau của secret key
  const SECRET_KEYS = [
    "trideptraivcl",
    "TRIDEPTRAIVCL", 
    "Trideptraivcl",
    "trideptraivcl123",
    "admin_secret_key"
  ];

  const handleEdit = (acc) => {
    setEditId(acc.id);
    setEditAccount({ fullName: acc.fullName, email: acc.email, roleId: acc.roleId?.toString() || '1' });
  };

  const handleEditSave = async () => {
    if (!editAccount.fullName || !editAccount.email) return;
    setSaving(true);
    try {
      // 1. Cập nhật thông tin cơ bản của user
      await api.put(`/users/${editId}/profile`, {
        fullName: editAccount.fullName,
        email: editAccount.email
      });

      // 2. Cập nhật role nếu có thay đổi
      const currentUser = accounts.find(acc => acc.id === editId);
      if (currentUser && currentUser.roleId?.toString() !== editAccount.roleId) {
        let roleName = 'user';
        if (editAccount.roleId === '2') roleName = 'admin';
        else if (editAccount.roleId === '3') roleName = 'moderator';
        
        console.log('Updating role for user:', {
          userId: editId,
          roleName: roleName,
          secretKey: SECRET_KEY
        });
        
        // Thử với các secret key khác nhau
        let roleUpdated = false;
        for (const secretKey of SECRET_KEYS) {
          try {
            console.log(`Trying secret key: ${secretKey}`);
            const roleResponse = await api.post('/signup/role', {
              userId: editId,
              roleName: roleName,
              secretKey: secretKey
            });
            console.log('Role update response:', roleResponse.data);
            roleUpdated = true;
            break;
          } catch (roleError) {
            console.error(`Role update error with secret key "${secretKey}":`, roleError.response?.data || roleError.message);
            if (roleError.response?.status === 400 && roleError.response?.data?.message === "Invalid secret key") {
              continue; // Thử secret key tiếp theo
            } else {
              throw roleError; // Lỗi khác, dừng lại
            }
          }
        }
        
        if (!roleUpdated) {
          console.error('All secret keys failed');
          alert('Không thể cập nhật role. Vui lòng kiểm tra secret key.');
        }
      }

      setEditId(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Cập nhật thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    setSaving(true);
    api.put(`/users/${id}/soft-delete`)
      .then(() => {
        console.log('User soft deleted successfully');
        fetchAccounts();
      })
      .catch((error) => {
        console.error('Delete error:', error.response?.data || error.message);
        alert('Xóa thất bại!');
      })
      .finally(() => setSaving(false));
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm tên/email..." className="w-64" />
          {/* XÓA nút 'Thêm tài khoản' */}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <img src={loadingGif} alt="loading" className="w-10 h-10" />
          </div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Họ tên</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Trạng thái</th>
                <th className="px-4 py-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                editId === acc.id ? (
                  <tr key={acc.id} className="bg-yellow-50">
                    <td className="px-4 py-2 border">{acc.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={editAccount.fullName} onChange={e => setEditAccount(a => ({ ...a, fullName: e.target.value }))} />
                    </td>
                    <td className="px-4 py-2 border">
                      <Input value={editAccount.email} onChange={e => setEditAccount(a => ({ ...a, email: e.target.value }))} />
                    </td>
                    <td className="px-4 py-2 border">
                      <select value={editAccount.roleId} onChange={e => setEditAccount(a => ({ ...a, roleId: e.target.value }))} className="border rounded px-2 py-1">
                        <option value="1">User</option>
                        <option value="2">Admin</option>
                        <option value="3">Mod</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">{acc.isActive ? 'Hoạt động' : 'Đã xóa'}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 text-white" onClick={handleEditSave} disabled={saving}>Lưu</Button>
                      <Button size="sm" className="bg-gray-400 text-white" onClick={() => setEditId(null)} disabled={saving}>Hủy</Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={acc.id} className={`even:bg-slate-50 ${!acc.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-2 border">{acc.id}</td>
                    <td className="px-4 py-2 border">{acc.fullName}</td>
                    <td className="px-4 py-2 border">{acc.email}</td>
                    <td className="px-4 py-2 border">{acc.roleId === 2 ? 'Admin' : acc.roleId === 3 ? 'Mod' : 'User'}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${acc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {acc.isActive ? 'Hoạt động' : 'Đã xóa'}
                      </span>
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 text-white" onClick={() => handleEdit(acc)} disabled={saving || !acc.isActive}>Sửa</Button>
                      <Button size="sm" className="bg-red-500 text-white" onClick={() => handleDelete(acc.id)} disabled={saving || !acc.isActive}>Xóa</Button>
                    </td>
                  </tr>
                )
              ))}
              {/* XÓA phần render thêm tài khoản */}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAccount; 