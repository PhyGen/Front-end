import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../../config/axios';
import AddIcon from '@/assets/icons/add-symbol-svgrepo-com.svg';
import loadingGif from '@/assets/icons/loading.gif';

function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const AdminTextbook = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ id: '', name: '' });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [filterName, setFilterName] = useState("");

  const fetchTextbooks = () => {
    setLoading(true);
    api.get('/text-books')
      .then(res => setTextbooks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTextbooks();
  }, []);

  const handleAdd = () => {
    if (adding) return;
    const nextId = textbooks.length > 0 ? Math.max(...textbooks.map(t => t.id)) + 1 : 1;
    setNewRow({ id: nextId, name: '' });
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewRow({ id: '', name: '' });
  };

  const handleCreate = () => {
    if (!newRow.name.trim()) return;
    setAdding(false);
    setNewRow({ id: '', name: '' });
    api.post('/text-books', { name: newRow.name })
      .then(fetchTextbooks)
      .catch(console.error);
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setEditRow({ id: t.id, name: t.name });
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditRow({ id: '', name: '' });
  };
  const handleEditSave = async () => {
    if (!editRow.name.trim()) return;
    setSaving(true);
    try {
      await api.put(`/text-books/${editRow.id}`, { id: editRow.id, name: editRow.name });
      setEditId(null);
      setEditRow({ id: '', name: '' });
      fetchTextbooks();
    } catch (e) {
      alert('Lưu thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/text-books/${id}`);
      fetchTextbooks();
    } catch (e) {
      alert('Xóa thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Textbook Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            placeholder="Tìm kiếm tên sách giáo khoa"
            className="w-64"
          />
          <Button onClick={handleAdd} className="flex items-center gap-1 bg-black hover:bg-neutral-800 text-white">
            <img src={AddIcon} alt="add" className="w-4 h-4" />
            Thêm
          </Button>
        </div>
        <div className="overflow-x-auto min-h-[120px]">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <img src={loadingGif} alt="loading" className="w-10 h-10" />
            </div>
          ) : (
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Tên sách giáo khoa</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {textbooks.filter(t => t.name.toLowerCase().includes(filterName.toLowerCase())).map(t => (
                  editId === t.id ? (
                    <tr key={t.id} className="bg-yellow-50">
                      <td className="px-4 py-2 border font-semibold">{editRow.id}</td>
                      <td className="px-4 py-2 border">
                        <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} />
                      </td>
                      <td className="px-4 py-2 border">{formatDate(t.createdAt)}</td>
                      <td className="px-4 py-2 border">{formatDate(t.updatedAt)}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={saving || !editRow.name.trim()}>Save</Button>
                        <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleEditCancel} disabled={saving}>Cancel</Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={t.id} className="even:bg-slate-50">
                      <td className="px-4 py-2 border">{t.id}</td>
                      <td className="px-4 py-2 border">{t.name}</td>
                      <td className="px-4 py-2 border">{formatDate(t.createdAt)}</td>
                      <td className="px-4 py-2 border">{formatDate(t.updatedAt)}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(t)}>Edit</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(t.id)} disabled={deletingId === t.id}>{deletingId === t.id ? '...' : 'Delete'}</Button>
                      </td>
                    </tr>
                  )
                ))}
                {adding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{newRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={newRow.name} onChange={e => setNewRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên sách giáo khoa" />
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreate} disabled={!newRow.name.trim()}>Create</Button>
                      <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleCancel}>Cancel</Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTextbook; 