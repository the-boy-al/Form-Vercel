'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reminds, setReminds] = useState('');
  const [autoResponses, setAutoResponses] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('taskToken');
    if (storedToken) setToken(storedToken); 
    
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!token) {
      setMessage(e);
      return;
    }

    const taskData = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()), 
      budget_from: Number(budgetFrom),
      budget_to: Number(budgetTo),
      deadline_days: Number(deadline),
      number_of_reminders: Number(reminds),
      private_content: null,
      is_hard: true,
      all_auto_responses: autoResponses,
      rules: {
        budget_from: Number(budgetFrom),
        budget_to: Number(budgetTo),
        deadline_days: Number(deadline),
        qty_freelancers: 1,
      }
    };

    try {
      const response = await fetch('https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Задача опубликована успешно!');
      } else {
        setMessage(`Ошибка: ${result.error || 'Не удалось создать задачу'}`);
      }
    } catch (error) {
      setMessage('Ошибка сети при отправке запроса.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Создать задачу</h1>
        {message && <div className="mb-4 text-center text-red-500">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" className="w-full p-2 border rounded" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" className="w-full p-2 border rounded" required></textarea>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Теги (через запятую)" className="w-full p-2 border rounded" />
          <input type="number" value={budgetFrom} onChange={(e) => setBudgetFrom(e.target.value)} placeholder="Бюджет от" className="w-full p-2 border rounded" required />
          <input type="number" value={budgetTo} onChange={(e) => setBudgetTo(e.target.value)} placeholder="Бюджет до" className="w-full p-2 border rounded" required />
          <input type="number" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Дедлайн (в днях)" className="w-full p-2 border rounded" required />
          <input type="number" value={reminds} onChange={(e) => setReminds(e.target.value)} placeholder="Напоминания" className="w-full p-2 border rounded" />
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={autoResponses} onChange={(e) => setAutoResponses(e.target.checked)} />
            <span>Автоответы</span>
          </label>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Отправить</button>
        </form>
      </div>
    </div>
  );
}
