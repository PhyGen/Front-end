import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../../config/axios';
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

const ModGrade = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ encodedId: '', name: '' });
  const [saving, setSaving] = useState(false);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = () => {
    setLoading(true);
    api.get('/grades')
      .then(res => {
        setGrades(res.data)
        console.log("Grades trả về",res.data)
      }
    )
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // --- EDIT ---
  const handleEdit = (g) => {
    setEditId(g.encodedId);
    setEditRow({ encodedId: g.encodedId, name: g.name });
  };
  
  const handleEditCancel = () => {
    setEditId(null);
    setEditRow({ encodedId: '', name: '' });
  };
  const handleEditSave = async () => {
    if (!editRow.name.trim()) return;
    setSaving(true);
    try {
      await api.put(`/grades/${editRow.encodedId}`, { id: editRow.encodedId, name: editRow.name });
      setEditId(null);
      setEditRow({ encodedId: '', name: '' });
      fetchGrades();
    } catch (e) {
      alert('Lưu thất bại!');
    } finally {
      setSaving(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            placeholder="Tìm kiếm tên lớp"
            className="w-64"
          />
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
                {grades
                  .filter(g => g.name.toLowerCase().includes(filterName.toLowerCase()))
                  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                  .map((g, index) => (
                    editId === g.encodedId ? (
                      <tr key={g.encodedId} className="bg-yellow-50">
                        <td className="px-4 py-2 border font-semibold">{index + 1}</td>
                        <td className="px-4 py-2 border">
                          <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} />
                        </td>
                        <td className="px-4 py-2 border">{formatDate(g.createdAt)}</td>
                        <td className="px-4 py-2 border">{formatDate(g.updatedAt)}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={saving || !editRow.name.trim()}>Save</Button>
                          <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleEditCancel} disabled={saving}>Cancel</Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={g.encodedId} className="even:bg-slate-50">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{g.name}</td>
                        <td className="px-4 py-2 border">{formatDate(g.createdAt)}</td>
                        <td className="px-4 py-2 border">{formatDate(g.updatedAt)}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(g)}>Edit</Button>
                        </td>
                      </tr>
                    )
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModGrade; 