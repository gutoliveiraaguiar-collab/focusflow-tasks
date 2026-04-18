document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const emptyMessage = document.getElementById('empty-message');

    // ==================== ARRAY DE TAREFAS ====================
    let tasks = [];

    // ==================== CARREGAR TAREFAS DO LOCALSTORAGE ====================
    function loadTasks() {
        const savedTasks = localStorage.getItem('focusflow-tasks');
        
        if (savedTasks) {
            try {
                tasks = JSON.parse(savedTasks);
            } catch (e) {
                console.error('Erro ao carregar tarefas:', e);
                tasks = [];
            }
        }

        // Se não houver tarefas salvas, cria exemplos
        if (tasks.length === 0) {
            tasks = [
                { id: Date.now() - 100000, text: 'Bem-vindo ao FocusFlow Tasks!', completed: false },
                { id: Date.now() - 50000, text: 'Clique no texto para marcar como concluída', completed: true },
                { id: Date.now() - 10000, text: 'Clique na lixeira para excluir', completed: false }
            ];
        }
    }

    // ==================== SALVAR TAREFAS ====================
    function saveTasks() {
        localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
    }

    // ==================== RENDERIZAR TAREFAS ====================
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            emptyMessage.style.display = 'block';
            taskCounter.textContent = '0 tarefas';
            return;
        }

        emptyMessage.style.display = 'none';

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <i class="bi ${task.completed ? 'bi-check-circle-fill task-check' : 'bi-circle task-check'}"></i>
                <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
                <div class="task-actions">
                    <i class="bi bi-trash delete-btn" onclick="deleteTask(${task.id})" title="Excluir tarefa"></i>
                </div>
            `;

            taskList.appendChild(taskItem);
        });

        // Atualizar contador
        const completedCount = tasks.filter(t => t.completed).length;
        taskCounter.textContent = `${tasks.length} tarefas (${completedCount} concluídas)`;
    }

    // ==================== ADICIONAR TAREFA ====================
    function addTask() {
        const text = taskInput.value.trim();

        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.unshift(newTask);
        taskInput.value = '';
        saveTasks();
        renderTasks();

        // Animação nova tarefa
        const firstTask = taskList.querySelector('.task-item');
        if (firstTask) firstTask.style.animation = 'fadeIn 0.3s ease';
    }

    // ==================== TOGGLE TAREFA ====================
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    // ==================== DELETAR TAREFA ====================
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    // ==================== LIMPAR CONCLUÍDAS ====================
    function clearCompleted() {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    }

    // ==================== EVENT LISTENERS ====================
    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearAllBtn.addEventListener('click', clearCompleted);

    // ==================== INICIALIZAÇÃO ====================
    loadTasks();
    renderTasks();
});
