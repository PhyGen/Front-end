import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import api from '../../config/axios';
import AddIcon from '@/assets/icons/add-symbol-svgrepo-com.svg';
import loadingGif from '@/assets/icons/loading.gif';

const ModChapter = () => {
  const [chapters, setChapters] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [newChapter, setNewChapter] = useState({ name: '', semesterId: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ id: '', name: '', semesterId: '' });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '', semesterId: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/chapters'),
      api.get('/semesters')
    ])
      .then(([chapterRes, semesterRes]) => {
        setChapters(chapterRes.data);
        setSemesters(semesterRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    if (adding) return;
    const nextId = chapters.length > 0 ? Math.max(...chapters.map(c => c.id)) + 1 : 1;
    setNewRow({ id: nextId, name: '', semesterId: '' });
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewRow({ id: '', name: '', semesterId: '' });
  };

  const handleCreate = () => {
    if (!newRow.name.trim() || !newRow.semesterId) return;
    setChapters([...chapters, { ...newRow, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    setAdding(false);
    setNewRow({ id: '', name: '', semesterId: '' });
  };

  const handleEdit = (id) => {
    const chapter = chapters.find(c => c.id === id);
    if (chapter) {
      setEditId(id);
      setEditRow({ id: id, name: chapter.name, semesterId: chapter.semesterId });
    }
  };

  const handleEditSave = async () => {
    if (!editRow.name.trim() || !editRow.semesterId) return;
    setSaving(true);
    try {
      await api.put(`/chapters/${editRow.id}`, { id: editRow.id, name: editRow.name, semesterId: editRow.semesterId });
      setChapters(chapters.map(c => c.id === editRow.id ? { ...c, name: editRow.name, semesterId: editRow.semesterId } : c));
      setEditId(null);
      setEditRow({ id: '', name: '', semesterId: '' });
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
      await api.delete(`/chapters/${id}`);
      setChapters(chapters.filter(c => c.id !== id));
    } catch (e) {
      alert('Xóa thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input value={newChapter.name} onChange={e => setNewChapter(s => ({ ...s, name: e.target.value }))} placeholder="Tên chương mới" />
          <Select value={newChapter.semesterId} onValueChange={v => setNewChapter(s => ({ ...s, semesterId: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
            <SelectContent>
              {semesters.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
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
                  <th className="px-4 py-2 border">Tên chương</th>
                  <th className="px-4 py-2 border">Học kỳ</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map(c => (
                  <tr key={c.id} className="even:bg-slate-50">
                    <td className="px-4 py-2 border">{c.id}</td>
                    <td className="px-4 py-2 border">{c.name}</td>
                    <td className="px-4 py-2 border">{semesters.find(s => s.id === c.semesterId)?.name || c.semesterId}</td>
                    <td className="px-4 py-2 border">{c.createdAt}</td>
                    <td className="px-4 py-2 border">{c.updatedAt}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(c.id)}>Edit</Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(c.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
                {adding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{newRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={newRow.name} onChange={e => setNewRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên chương" />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select value={newRow.semesterId} onValueChange={v => setNewRow(r => ({ ...r, semesterId: v }))}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
                        <SelectContent>
                          {semesters.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreate} disabled={!newRow.name.trim() || !newRow.semesterId}>Create</Button>
                      <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleCancel}>Cancel</Button>
                    </td>
                  </tr>
                )}
                {editId && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{editRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên chương" />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select value={editRow.semesterId} onValueChange={v => setEditRow(r => ({ ...r, semesterId: v }))}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
                        <SelectContent>
                          {semesters.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={!editRow.name.trim() || !editRow.semesterId}>Save</Button>
                      <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setEditId(null)}>Cancel</Button>
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

export default ModChapter; 