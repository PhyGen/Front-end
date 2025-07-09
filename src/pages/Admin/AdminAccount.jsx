import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../../config/axios';
import loadingGif from '@/assets/icons/loading.gif';

const AdminAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newAccount, setNewAccount] = useState({ fullName: '', email: '', password: '', roleId: '1' });
  const [editId, setEditId] = useState(null);
  const [editAccount, setEditAccount] = useState({ fullName: '', email: '', roleId: '1' });
  const [saving, setSaving] = useState(false);
  const [banningId, setBanningId] = useState(null);
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

  const handleAdd = () => {
    setAdding(true);
    setNewAccount({ fullName: '', email: '', password: '', roleId: '1' });
  };

  const handleCreate = () => {
    if (!newAccount.fullName || !newAccount.email || !newAccount.password) return;
    setSaving(true);
    api.post('/users', newAccount)
      .then(() => { setAdding(false); fetchAccounts(); })
      .catch(() => alert('Tạo tài khoản thất bại!'))
      .finally(() => setSaving(false));
  };

  const handleEdit = (acc) => {
    setEditId(acc.id);
    setEditAccount({ fullName: acc.fullName, email: acc.email, roleId: acc.roleId?.toString() || '1' });
  };

  const handleEditSave = () => {
    setSaving(true);
    api.put(`/users/${editId}`, editAccount)
      .then(() => { setEditId(null); fetchAccounts(); })
      .catch(() => alert('Cập nhật thất bại!'))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    setSaving(true);
    api.delete(`/users/${id}`)
      .then(fetchAccounts)
      .catch(() => alert('Xóa thất bại!'))
      .finally(() => setSaving(false));
  };

  const handleBanToggle = (acc) => {
    setBanningId(acc.id);
    api.patch(`/users/${acc.id}/ban`, { banned: !acc.banned })
      .then(fetchAccounts)
      .catch(() => alert('Cập nhật trạng thái thất bại!'))
      .finally(() => setBanningId(null));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm tên/email..." className="w-64" />
          <Button onClick={handleAdd} className="bg-blue-500 text-white">Thêm tài khoản</Button>
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
                    <td className="px-4 py-2 border">{acc.banned ? 'Bị cấm' : 'Hoạt động'}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 text-white" onClick={handleEditSave} disabled={saving}>Lưu</Button>
                      <Button size="sm" className="bg-gray-400 text-white" onClick={() => setEditId(null)} disabled={saving}>Hủy</Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={acc.id} className="even:bg-slate-50">
                    <td className="px-4 py-2 border">{acc.id}</td>
                    <td className="px-4 py-2 border">{acc.fullName}</td>
                    <td className="px-4 py-2 border">{acc.email}</td>
                    <td className="px-4 py-2 border">{acc.roleId === 2 ? 'Admin' : acc.roleId === 3 ? 'Mod' : 'User'}</td>
                    <td className="px-4 py-2 border">{acc.banned ? 'Bị cấm' : 'Hoạt động'}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 text-white" onClick={() => handleEdit(acc)} disabled={saving}>Sửa</Button>
                      <Button size="sm" className="bg-red-500 text-white" onClick={() => handleDelete(acc.id)} disabled={saving}>Xóa</Button>
                      <Button size="sm" className={acc.banned ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'} onClick={() => handleBanToggle(acc)} disabled={banningId === acc.id}>
                        {acc.banned ? 'Mở cấm' : 'Cấm'}
                      </Button>
                    </td>
                  </tr>
                )
              ))}
              {adding && (
                <tr className="bg-green-50">
                  <td className="px-4 py-2 border">#</td>
                  <td className="px-4 py-2 border">
                    <Input value={newAccount.fullName} onChange={e => setNewAccount(a => ({ ...a, fullName: e.target.value }))} placeholder="Họ tên" />
                  </td>
                  <td className="px-4 py-2 border">
                    <Input value={newAccount.email} onChange={e => setNewAccount(a => ({ ...a, email: e.target.value }))} placeholder="Email" />
                  </td>
                  <td className="px-4 py-2 border">
                    <select value={newAccount.roleId} onChange={e => setNewAccount(a => ({ ...a, roleId: e.target.value }))} className="border rounded px-2 py-1">
                      <option value="1">User</option>
                      <option value="2">Admin</option>
                      <option value="3">Mod</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border">-</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <Input value={newAccount.password} onChange={e => setNewAccount(a => ({ ...a, password: e.target.value }))} placeholder="Mật khẩu" type="password" />
                    <Button size="sm" className="bg-blue-500 text-white" onClick={handleCreate} disabled={saving}>Tạo</Button>
                    <Button size="sm" className="bg-gray-400 text-white" onClick={() => setAdding(false)} disabled={saving}>Hủy</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAccount; 