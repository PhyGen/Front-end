import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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

const AdminSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newSemester, setNewSemester] = useState({ name: '', gradeId: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ id: '', name: '', gradeId: '' });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '', gradeId: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterGradeId, setFilterGradeId] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/semesters'),
      api.get('/grades')
    ])
      .then(([semesterRes, gradeRes]) => {
        setSemesters(semesterRes.data);
        setGrades(gradeRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    if (adding) return;
    const nextId = semesters.length > 0 ? Math.max(...semesters.map(s => s.id)) + 1 : 1;
    setNewRow({ id: nextId, name: '', gradeId: '' });
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewRow({ id: '', name: '', gradeId: '' });
  };

  const handleCreate = () => {
    if (!newRow.name.trim() || !newRow.gradeId) return;
    setAdding(false);
    setNewRow({ id: '', name: '', gradeId: '' });
    api.post('/semesters', { name: newRow.name, gradeId: newRow.gradeId })
      .then(fetchData)
      .catch(console.error);
  };

  const handleEdit = (id) => {
    const semester = semesters.find(s => s.id === id);
    if (semester) {
      setEditId(id);
      setEditRow({ id: id, name: semester.name, gradeId: semester.gradeId });
    }
  };

  const handleEditSave = async () => {
    if (!editRow.name.trim() || !editRow.gradeId) return;
    setSaving(true);
    try {
      await api.put(`/semesters/${editRow.id}`, { id: editRow.id, name: editRow.name, gradeId: editRow.gradeId });
      setEditId(null);
      setEditRow({ id: '', name: '', gradeId: '' });
      fetchData();
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
      await api.delete(`/semesters/${id}`);
      fetchData();
    } catch (e) {
      alert('Xóa thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semester Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input value={newSemester.name} onChange={e => setNewSemester(s => ({ ...s, name: e.target.value }))} placeholder="Tên học kỳ mới" />
          <Select value={newSemester.gradeId} onValueChange={v => setNewSemester(s => ({ ...s, gradeId: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
            <SelectContent>
              {grades.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>)}
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
                  <th className="px-4 py-2 border">Tên học kỳ</th>
                  <th className="px-4 py-2 border">Lớp</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesters.filter(s =>
                  s.name.toLowerCase().includes(filterName.toLowerCase()) &&
                  (filterGradeId === "" || s.gradeId?.toString() === filterGradeId)
                ).map(s => (
                  editId === s.id ? (
                    <tr key={s.id} className="bg-yellow-50">
                      <td className="px-4 py-2 border font-semibold">{editRow.id}</td>
                      <td className="px-4 py-2 border">
                        <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên học kỳ" />
                      </td>
                      <td className="px-4 py-2 border">
                        <Select value={editRow.gradeId} onValueChange={v => setEditRow(r => ({ ...r, gradeId: v }))}>
                          <SelectTrigger className="w-32"><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                          <SelectContent>
                            {grades.map(g => (
                              <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2 border">{formatDate(s.createdAt)}</td>
                      <td className="px-4 py-2 border">{formatDate(s.updatedAt)}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={!editRow.name.trim() || !editRow.gradeId}>Save</Button>
                        <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setEditId(null)}>Cancel</Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={s.id} className="even:bg-slate-50">
                      <td className="px-4 py-2 border">{s.id}</td>
                      <td className="px-4 py-2 border">{s.name}</td>
                      <td className="px-4 py-2 border">{grades.find(g => g.id === s.gradeId)?.name || s.gradeId}</td>
                      <td className="px-4 py-2 border">{formatDate(s.createdAt)}</td>
                      <td className="px-4 py-2 border">{formatDate(s.updatedAt)}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(s.id)}>Edit</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(s.id)}>Delete</Button>
                      </td>
                    </tr>
                  )
                ))}
                {adding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{newRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={newRow.name} onChange={e => setNewRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên học kỳ" />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select value={newRow.gradeId} onValueChange={v => setNewRow(r => ({ ...r, gradeId: v }))}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                        <SelectContent>
                          {grades.map(g => (
                            <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreate} disabled={!newRow.name.trim() || !newRow.gradeId}>Create</Button>
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

export default AdminSemester; 