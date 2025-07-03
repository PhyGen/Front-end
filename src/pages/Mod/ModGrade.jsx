import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../../config/axios';
import AddIcon from '@/assets/icons/add-symbol-svgrepo-com.svg';
import loadingGif from '@/assets/icons/loading.gif';

const ModGrade = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ id: '', name: '' });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = () => {
    setLoading(true);
    api.get('/grades')
      .then(res => setGrades(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (adding) return;
    const nextId = grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1;
    setNewRow({ id: nextId, name: '' });
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewRow({ id: '', name: '' });
  };

  const handleCreate = () => {
    if (!newRow.name.trim()) return;
    setGrades([...grades, { ...newRow, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    setAdding(false);
    setNewRow({ id: '', name: '' });
  };

  // --- EDIT ---
  const handleEdit = (g) => {
    setEditId(g.id);
    setEditRow({ id: g.id, name: g.name });
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditRow({ id: '', name: '' });
  };
  const handleEditSave = async () => {
    if (!editRow.name.trim()) return;
    setSaving(true);
    try {
      await api.put(`/grades/${editRow.id}`, { id: editRow.id, name: editRow.name });
      setGrades(grades.map(g => g.id === editRow.id ? { ...g, name: editRow.name } : g));
      setEditId(null);
      setEditRow({ id: '', name: '' });
    } catch (e) {
      alert('Lưu thất bại!');
    } finally {
      setSaving(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/grades/${id}`);
      setGrades(grades.filter(g => g.id !== id));
    } catch (e) {
      alert('Xóa thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
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
                  <th className="px-4 py-2 border">Tên lớp</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  editId === g.id ? (
                    <tr key={g.id} className="bg-yellow-50">
                      <td className="px-4 py-2 border font-semibold">{g.id}</td>
                      <td className="px-4 py-2 border">
                        <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} />
                      </td>
                      <td className="px-4 py-2 border">{g.createdAt}</td>
                      <td className="px-4 py-2 border">{g.updatedAt}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={saving || !editRow.name.trim()}>Save</Button>
                        <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleEditCancel} disabled={saving}>Cancel</Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={g.id} className="even:bg-slate-50">
                      <td className="px-4 py-2 border">{g.id}</td>
                      <td className="px-4 py-2 border">{g.name}</td>
                      <td className="px-4 py-2 border">{g.createdAt}</td>
                      <td className="px-4 py-2 border">{g.updatedAt}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(g)}>Edit</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(g.id)} disabled={deletingId === g.id}>{deletingId === g.id ? '...' : 'Delete'}</Button>
                      </td>
                    </tr>
                  )
                ))}
                {adding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{newRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={newRow.name} onChange={e => setNewRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên lớp" />
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

export default ModGrade; 