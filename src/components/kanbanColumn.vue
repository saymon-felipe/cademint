<template>
    <Draggable class="kanban-column" :id="'column-' + column.id">
      <div class="kanban-column">
        <div class="kanban-column-header">
          <div class="column-informations">
            <div class="column-name-container">
              <input
                type="text"
                v-on:keyup="handleRenameColumnKeyup($event)"
                @focusout="renameColumn($event)"
                class="rename-column-input"
                style="display: none;"
              />
              <p class="font-size-5 column-name">{{ column.name }}</p>
              <span class="material-icons" v-on:click="showMoreOptions">more_vert</span>
              <div class="more-options">
                <ul>
                  <li v-on:click="excludeColumn">Excluir coluna</li>
                  <li v-on:click="showRenameColumn">Renomear coluna</li>
                </ul>
              </div>
              <span class="material-icons column-drag-handle" style="cursor: grab;">drag_handle</span>
            </div>
            <div class="search-tasks-container">
              <span
                class="material-icons"
                v-if="!column.toggleSearchTasks"
                @click="activateSearch"
                title="Busque tarefas por ID, descrição ou responsável"
              >
                search
              </span>
  
              <input
                v-if="column.toggleSearchTasks"
                ref="searchInput"
                type="text"
                class="search-tasks-input"
                placeholder="Pesquisar tarefas"
                @keyup="searchTasks($event)"
                @focusout="column.toggleSearchTasks = false"
              />
            </div>
          </div>
          <span class="material-icons new-task-icon" v-on:click="createTask">add</span>
        </div>
        <div class="kanban-column-body">
          <p
            class="font-size-5"
            style="text-align: center; margin-top: 1rem; margin-bottom: -1rem;"
            v-if="column.filteredTasks.length == 0"
          >
            <i v-if="!newTask">{{ isResponsive ? "Atribua tarefas a esta coluna" : "Arraste tarefas para cá" }}</i>
          </p>
          <Container
            group-name="kanban"
            class="task-list"
            @drag-end="$emit('drag-end')"
            @drag-start="$emit('drag-start', column.id, $event)"
            @drop="$emit('drop', column.id, $event)"
            :get-child-payload="getChildPayload"
          >
            <newTaskCard
              :group_users="groupMembers"
              :card_status="column.id"
              :user="user"
              @closeTask="closeNewTask($event)"
              class="new-card"
            />
            <Draggable v-for="task in column.filteredTasks" :key="task.id" class="draggable-card">
              <card :task="task" />
              <div class="edit-task-wrapper-container" v-on:click="$emit('edit-task', task)"></div>
            </Draggable>
          </Container>
        </div>
      </div>
    </Draggable>
  </template>
  
  <script>
  import $ from 'jquery';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import card from './card.vue';
  import newTaskCard from './newTaskCard.vue';
  
  export default {
    name: 'KanbanColumn',
    components: {
      Draggable,
      card,
      Container,
      newTaskCard
    },
    props: {
      column: {
        type: Object,
        required: true
      },
      groupMembers: {
        type: Array,
        required: true
      },
      user: {
        type: Object,
        required: true
      },
      projectId: {
        type: [String, Number],
        required: true
      },
      isResponsive: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        searchInput: null,
        newTask: false
      };
    },
    methods: {
      activateSearch() {
        this.column.toggleSearchTasks = true;
        this.$nextTick(() => {
          this.$refs.searchInput?.focus();
        });
      },
      searchTasks(event) {
        this.column.filteredTasks = this.column.tasks.filter((task) => {
          return (
            task.desc_os.toLowerCase().includes(event.target.value.toLowerCase()) ||
            task.id.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            task.sponsor_name.toLowerCase().includes(event.target.value.toLowerCase())
          );
        });
      },
      showMoreOptions() {
        $(`#column-${this.column.id} .more-options`).show();
        this.$emit('show-wrapper');
      },
      showRenameColumn() {
        this.$emit('hide-more-options');
        const column = $(`#column-${this.column.id}`);
        $('.rename-column-input').val(column.find('.column-name').text());
  
        this.$nextTick(() => {
          column.find('.rename-column-input').show().focus();
          column.find('.column-name').hide();
        });
      },
      handleRenameColumnKeyup(event) {
        if (event.key == 'Enter') {
          this.renameColumn(event);
        }
      },
      renameColumn(event) {
        event.preventDefault();

        const name = $('#column-' + this.column.id + " .rename-column-input").val();
        
        if (name && name.trim() == "") {
          return;
        }

        $('.rename-column-input').hide();
        $('.column-name').show();
  
        this.$emit('rename-column', {
          project_id: this.projectId,
          column_id: this.column.id,
          name: name
        });

        $('.rename-column-input').val('');
      },
      excludeColumn() {
        this.$emit('hide-more-options');
        this.$emit('exclude-column', {
          project_id: this.projectId,
          column_id: this.column.id
        });
      },
      createTask() {
        this.newTask = true;
        this.$emit('create-task', this.column.id);
        $(`#column-${this.column.id} .kanban-column-body`).css("overflow-y", "visible");
      },
      closeNewTask(emmit_event) {
        const newTaskCard = $(`#column-${this.column.id} .new-card`);
        newTaskCard.css('opacity', 0);
        setTimeout(() => {
          newTaskCard.hide();
          this.newTask = false;
          if (emmit_event != undefined) {
            emmit_event.user_owner_name = this.user.nome;
            this.$emit('edit-task', emmit_event);
          }
        }, 400);
        $(`#column-${this.column.id} .kanban-column-body`).css("overflow-y", "auto");
      },
      getChildPayload(index) {
        return {
          index
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .kanban-column {
    min-width: 330px;
    max-width: 330px;
    width: 330px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0.8rem;
    max-height: calc(100vh - 172px);
  }
  
  .column-informations {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 1rem;
    position: relative;
    width: 100%;
  }
  
  .column-informations span {
    cursor: pointer;
    color: var(--gray-low);
  }
  
  .column-informations .more-options {
    position: absolute;
    background: var(--white);
    border-radius: 6px;
    top: -7%;
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);
    left: 100%;
    white-space: nowrap;
    overflow: hidden;
    display: none;
    z-index: 2;
  }
  
  .column-informations .more-options ul {
    list-style: none;
  }
  
  .column-informations .more-options ul li {
    padding: 0.8rem;
    cursor: pointer;
  }
  
  .column-informations .more-options ul li:hover {
    background: var(--gray-soft);
  }
  
  .column-name-container {
    display: flex;
    align-items: center;
    gap: 7px;
    position: relative;
  }
  
  .kanban-column-header {
    width: 100%;
    max-width: calc(100vw - 25px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 31px;
    margin-bottom: 10px;
  }
  
  .kanban-column-header:hover .column-drag-handle {
    opacity: 1;
  }
  
  .kanban-column-header p {
    text-transform: uppercase;
    color: var(--gray-low);
    margin-top: 3px;
    white-space: nowrap;
  }
  
  .column-drag-handle {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
    margin-right: 0.9rem;
  }
  
  .kanban-column-body {
    background: var(--gray-high);
    width: 100%;
    border-radius: 6px;
    padding: 10px;
    overflow-y: auto;
  }
  
  .search-tasks-container {
    display: grid;
    place-items: center;
    float: right;
  }

  .search-tasks-input {
    margin: 0 !important;
    height: 30px !important;
  }
  
  .new-task-icon {
    background: var(--blue-low);
    background-color: var(--blue-high-2);
    border-radius: 4px;
    padding: 3px;
    color: var(--blue-low);
    cursor: pointer;
  }
  
  .task-list .draggable-card {
    position: relative;
    cursor: pointer;
  }
  
  .task-list .draggable-card:last-child ::v-deep .card-task, .task-list .draggable-card:last-child ::v-deep .card-loading {
    margin-bottom: 0;
  }
  
  .edit-task-wrapper-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%;
    cursor: pointer;
    z-index: 1;
  }
  
  .new-card {
    display: none;
    opacity: 0;
    transition: all 0.4s;
  }
  
  @media (max-width: 720px) {
    .kanban-column {
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      height: 180px;
      max-height: 180px;
      min-height: 180px;
      margin: 1rem 0 2rem;
      align-items: flex-start;
    }
  
    .task-list {
      display: flex;
    }
  
    .kanban-column-body {
      height: auto;
      width: 100%;
      min-height: 100%;
      overflow-y: hidden;
      overflow-x: scroll;
    }
  
    .draggable-card {
      min-width: 230px;
    }
  
    .column-drag-handle {
      display: none;
    }
  }
  </style>