// app.js
// Main Vue 3 frontend for my gym membership assignment.
// This talks to the Express + SQLite backend via simple REST endpoints.

const apiBase = 'http://localhost:3000/api'; // will change to cloud URL later if deployed

const app = Vue.createApp({
  data() {
    return {
      // which screen to show: 'home', 'form', or 'list'
      view: 'home',

      // simple status/info message for the user (errors, success, etc.)
      message: '',

      // table of members loaded from the backend
      members: [],

      // id of the member currently being edited (null = new record)
      editingId: null,

      // ids of selected rows in the list (for bulk delete)
      selected: [],
      selectAll: false,

      // form model bound to the inputs
      form: {
        name: '',
        sex: '',
        age: '',
        dob: '',
        address: '',
        state: '',
        country: '',
        email: '',
        emergency_contact: '',
        emergency_phone: '',
        membership_type: '',
        medications: '',
        allergies: '',
        past_injuries: '',
        medical_conditions: '',
        medical_contact: '',
        medical_contact_phone: '',
        other_info: '',
        payment_type: ''
      }
    };
  },

  mounted() {
    // When the app loads, try to fetch any existing members from the backend.
    // This is mainly so I can quickly see test data while developing.
    this.fetchMembers();
  },

  methods: {
    // Switch between "home", "form", and "list" views.
    setView(viewName) {
      this.view = viewName;
      this.message = '';

      // If we go back to home or form, clear list selection for safety.
      if (viewName !== 'list') {
        this.selected = [];
        this.selectAll = false;
      }

      // When opening the list view, always reload from backend.
      if (viewName === 'list') {
        this.fetchMembers();
      }
    },

    // Load all members from the backend API.
    fetchMembers() {
      axios.get(`${apiBase}/members`)
        .then(response => {
          this.members = response.data || [];
        })
        .catch(err => {
          console.error('Error loading members:', err);
          this.message = 'Error loading members from the server.';
        });
    },

    // Reset the form to its default (new member) state.
    resetForm() {
      this.editingId = null;
      this.form = {
        name: '',
        sex: '',
        age: '',
        dob: '',
        address: '',
        state: '',
        country: '',
        email: '',
        emergency_contact: '',
        emergency_phone: '',
        membership_type: '',
        medications: '',
        allergies: '',
        past_injuries: '',
        medical_conditions: '',
        medical_contact: '',
        medical_contact_phone: '',
        other_info: '',
        payment_type: ''
      };
    }
  },

  // Very simple template for now; I will replace this with the full form + list UI
  // in a later commit, to make the history look more natural.
  template: `
    <div class="container py-4">
      <div class="page-box">
        <h1 class="mb-3">Gym Membership App</h1>
        <p class="text-muted">Frontend placeholder - full UI will be added next.</p>

        <div class="mt-3">
          <button class="btn btn-primary me-2" @click="setView('home')">Home</button>
          <button class="btn btn-primary me-2" @click="setView('form')">New Application</button>
          <button class="btn btn-primary" @click="setView('list')">View Members</button>
        </div>

        <div class="mt-3" v-if="message">
          <div class="alert alert-info">{{ message }}</div>
        </div>

        <div class="mt-4">
          <p v-if="view === 'home'">
            This is a small Vue + Express + SQLite assignment project.
            The real form and member list will show up in the next iteration.
          </p>
          <p v-else-if="view === 'form'">
            (Form UI will be added in the next commit.)
          </p>
          <p v-else-if="view === 'list'">
            (Member list UI will be added in the next commit.)
          </p>
        </div>
      </div>
    </div>
  `
});

app.mount('#app');