import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import categoryService from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const emptyForm = { title: '', ingredients: [''], steps: [''], cookingTime: '', image: '', category: '' };

function getErrorMessage(error) {
  const response = error.response?.data;
  if (response?.errors?.length) return response.errors.map((item) => item.msg).join(' ');
  return response?.message || 'Unable to save recipe.';
}

export default function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id;
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        const categoryResult = await categoryService.list();
        setCategories(categoryResult.data || []);
        if (editing) {
          const recipe = await recipeService.getById(id);
          const ownerId = recipe.createdBy?._id || recipe.createdBy;
          if (!userId || String(ownerId) !== String(userId)) {
            setError('Only the recipe owner can edit this recipe.');
            return;
          }
          setForm({
            title: recipe.title || '',
            ingredients: recipe.ingredients?.length ? recipe.ingredients : [''],
            steps: recipe.steps?.length ? recipe.steps : [''],
            cookingTime: recipe.cookingTime || '',
            image: recipe.image || '',
            category: recipe.category?._id || recipe.category || '',
          });
        }
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [editing, id, userId]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateList = (field, index, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => itemIndex === index ? value : item),
    }));
  };

  const addListItem = (field) => setForm((current) => ({ ...current, [field]: [...current[field], ''] }));

  const removeListItem = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].length === 1 ? [''] : current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      ...form,
      ingredients: form.ingredients.map((item) => item.trim()).filter(Boolean),
      steps: form.steps.map((item) => item.trim()).filter(Boolean),
      cookingTime: Number(form.cookingTime),
    };

    try {
      const saved = editing ? await recipeService.update(id, payload) : await recipeService.create(payload);
      navigate(`/recipes/${saved._id}`, { replace: true, state: { notice: editing ? 'Recipe updated.' : 'Recipe created.' } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="loading-state"><span className="spinner dark-spinner" /> Loading recipe...</main>;
  if (editing && error) return <main className="app-shell narrow-shell"><div className="alert error-alert" role="alert">{error}</div><Link className="back-link" to={`/recipes/${id}`}>Back to recipe</Link></main>;

  return (
    <main className="app-shell narrow-shell">
      <Link className="back-link" to={editing ? `/recipes/${id}` : '/'}>← Back</Link>
      <header className="page-header compact-header">
        <div><p className="eyebrow">Recipe editor</p><h1>{editing ? 'Edit recipe' : 'Add a recipe'}</h1></div>
      </header>
      {error && <div className="alert error-alert" role="alert">{error}</div>}
      <form className="recipe-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={updateField} required />

        <fieldset><legend>Ingredients</legend>
          {form.ingredients.map((item, index) => (
            <div className="dynamic-row" key={`ingredient-${index}`}>
              <input aria-label={`Ingredient ${index + 1}`} value={item} onChange={(event) => updateList('ingredients', index, event.target.value)} required />
              <button className="icon-button" type="button" onClick={() => removeListItem('ingredients', index)} aria-label="Remove ingredient">×</button>
            </div>
          ))}
          <button className="add-row-button" type="button" onClick={() => addListItem('ingredients')}>+ Add ingredient</button>
        </fieldset>

        <fieldset><legend>Steps</legend>
          {form.steps.map((item, index) => (
            <div className="dynamic-row" key={`step-${index}`}>
              <textarea aria-label={`Step ${index + 1}`} value={item} onChange={(event) => updateList('steps', index, event.target.value)} required />
              <button className="icon-button" type="button" onClick={() => removeListItem('steps', index)} aria-label="Remove step">×</button>
            </div>
          ))}
          <button className="add-row-button" type="button" onClick={() => addListItem('steps')}>+ Add step</button>
        </fieldset>

        <div className="form-two-column">
          <div><label htmlFor="cookingTime">Cooking time (minutes)</label><input id="cookingTime" name="cookingTime" type="number" min="1" value={form.cookingTime} onChange={updateField} required /></div>
          <div><label htmlFor="category">Category</label><select id="category" name="category" value={form.category} onChange={updateField} required><option value="">Choose a category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></div>
        </div>
        <label htmlFor="image">Image URL (optional)</label>
        <input id="image" name="image" type="url" value={form.image} onChange={updateField} placeholder="https://..." />
        <button className="primary-button submit-form-button" type="submit" disabled={submitting}>{submitting ? <><span className="spinner" /> Saving...</> : editing ? 'Save changes' : 'Create recipe'}</button>
      </form>
    </main>
  );
}
