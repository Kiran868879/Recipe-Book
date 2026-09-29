import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';

const defaultCategories = [
  { name: 'Breakfast', description: 'Morning favorites' },
  { name: 'Lunch', description: 'Midday meals' },
  { name: 'Dinner', description: 'Evening mains' },
];

function getErrorMessage(error) {
  const response = error.response?.data;
  if (response?.errors?.length) return response.errors.map((item) => item.msg).join(' ');
  return response?.message || 'Unable to update categories.';
}

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadCategories = async () => {
    try {
      const result = await categoryService.list();
      const existingCategories = result.data || [];
      const existingNames = new Set(existingCategories.map((category) => category.name.toLowerCase()));

      for (const category of defaultCategories) {
        if (!existingNames.has(category.name.toLowerCase())) {
          await categoryService.create(category);
        }
      }

      const refreshed = await categoryService.list();
      setCategories(refreshed.data || []);
    } catch (requestError) {
      setMessage({ type: 'error', text: getErrorMessage(requestError) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await categoryService.create({ name: newName, description: newDescription });
      setNewName('');
      setNewDescription('');
      setMessage({ type: 'success', text: 'Category created.' });
      await loadCategories();
    } catch (requestError) {
      setMessage({ type: 'error', text: getErrorMessage(requestError) });
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
    setEditingDescription(category.description || '');
  };

  const handleUpdate = async (id) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await categoryService.update(id, { name: editingName, description: editingDescription });
      setEditingId(null);
      setMessage({ type: 'success', text: 'Category updated.' });
      await loadCategories();
    } catch (requestError) {
      setMessage({ type: 'error', text: getErrorMessage(requestError) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setSubmitting(true);
    try {
      await categoryService.remove(id);
      setMessage({ type: 'success', text: 'Category deleted.' });
      await loadCategories();
    } catch (requestError) {
      setMessage({ type: 'error', text: getErrorMessage(requestError) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="app-shell category-page-shell">
      <Link className="back-link" to="/">← Back to dashboard</Link>

      <section className="category-hero" aria-label="Category management hero">
        <div className="category-hero-copy">
          <p className="eyebrow">Organize your recipes</p>
          <h1>Kitchen categories</h1>
          <p className="page-subtitle">Create, edit, and manage the collections that keep your menu flowing beautifully.</p>
        </div>

        <div className="category-hero-visual">
          <div className="category-photo-glow" aria-hidden="true" />
          <img
            className="category-photo"
            src="/images/chef-category.png"
            alt="Professional chef cooking in a restaurant kitchen"
          />
        </div>
      </section>

      <header className="page-header compact-header"><div><p className="eyebrow">Manage collections</p><h1>Categories</h1></div></header>
      {message.text && <div className={`alert ${message.type === 'error' ? 'error-alert' : 'success-alert'}`} role="status">{message.text}</div>}
      <form className="category-create-form" onSubmit={handleCreate}>
        <input aria-label="New category name" placeholder="Category name" value={newName} onChange={(event) => setNewName(event.target.value)} required />
        <input aria-label="New category description" placeholder="Description (optional)" value={newDescription} onChange={(event) => setNewDescription(event.target.value)} />
        <button className="primary-button" type="submit" disabled={submitting}>Add category</button>
      </form>
      {loading ? <div className="loading-state"><span className="spinner dark-spinner" /> Loading categories...</div> : categories.length ? (
        <div className="category-table-wrap"><table className="category-table"><thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead><tbody>
          {categories.map((category) => <tr key={category._id}>
            {editingId === category._id ? <><td><input value={editingName} onChange={(event) => setEditingName(event.target.value)} /></td><td><input value={editingDescription} onChange={(event) => setEditingDescription(event.target.value)} /></td><td className="table-actions"><button className="primary-button" type="button" onClick={() => handleUpdate(category._id)} disabled={submitting}>Save</button><button className="secondary-button" type="button" onClick={() => setEditingId(null)}>Cancel</button></td></> : <><td>{category.name}</td><td>{category.description || '—'}</td><td className="table-actions"><button className="secondary-button" type="button" onClick={() => startEditing(category)}>Edit</button><button className="danger-button" type="button" onClick={() => handleDelete(category._id)} disabled={submitting}>Delete</button></td></>}
          </tr>)}
        </tbody></table></div>
      ) : <div className="empty-state"><h2>No categories yet</h2><p>Add one above to organize your recipes.</p></div>}
    </main>
  );
}
