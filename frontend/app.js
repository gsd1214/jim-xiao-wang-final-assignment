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

      if (viewName !== 'list') {
        // leaving the list view, clear selection so it doesn't get stale
        this.selected = [];
        this.selectAll = false;
      }

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
    },

    // Slightly stricter validation for the main required fields.
validateForm() {

  const name = (this.form.name || '').trim();
  const email = (this.form.email || '').trim();
  const membership = (this.form.membership_type || '').trim();
  const country = (this.form.country || '').trim();

  if (!name) {
    this.message = 'Full name is required.';
    return false;
  }

  if (!email) {
    this.message = 'Email is required.';
    return false;
  }

  // Very simple email format check.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    this.message = 'Please enter a valid email address.';
    return false;
  }

  if (!membership) {
    this.message = 'Please choose a membership type.';
    return false;
  }

  if (!country) {
    this.message = 'Country is required.';
    return false;
  }

  // Age is optional, but if provided it should be a positive number.
  if (this.form.age !== '' && this.form.age !== null) {
    const ageNum = Number(this.form.age);
    if (Number.isNaN(ageNum) || ageNum <= 0) {
      this.message = 'Age must be a positive number if provided.';
      return false;
    }
  }

  // Emergency phone is optional, but if entered
  // enforce basic length and numeric rules.
  if (this.form.emergency_phone) {
    if (!this.isReasonablePhone(this.form.emergency_phone)) {
      this.message = 'Emergency phone should be 10–15 digits (you can include + and spaces).';
      return false;
    }
  }

  // Medical contact phone is also optional but checked if present.
  if (this.form.medical_contact_phone) {
    if (!this.isReasonablePhone(this.form.medical_contact_phone)) {
      this.message = 'Medical contact phone should be 10–15 digits (you can include + and spaces).';
      return false;
    }
  }

  this.message = '';
  return true;
},
// Allow numbers, spaces and +, but enforce 10–15 digits overall.
// This helper is used for both emergency and medical phone fields.
isReasonablePhone(value) {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  const len = digitsOnly.length;
  return len >= 10 && len <= 15;
},

    // Save handler for both "create" and "update".
    saveMember() {
      if (!this.validateForm()) return;

      // If editingId is set, we are updating an existing record.
      if (this.editingId) {
        axios.put(`${apiBase}/members/${this.editingId}`, this.form)
          .then(() => {
            this.message = 'Member updated successfully.';
            this.fetchMembers();
            this.view = 'list';
            this.resetForm();
          })
          .catch(err => {
            console.error('Error updating member:', err);
            this.message = 'Error updating member.';
          });
      } else {
        // Otherwise we create a new record.
        axios.post(`${apiBase}/members`, this.form)
          .then(() => {
            this.message = 'Member saved successfully.';
            this.fetchMembers();
            this.view = 'list';
            this.resetForm();
          })
          .catch(err => {
            console.error('Error saving member:', err);
            this.message = 'Error saving member.';
          });
      }
    },

    // Load a row into the form for editing.
    editMember(member) {
      this.editingId = member.id;
      this.form = {
        name: member.name || '',
        sex: member.sex || '',
        age: member.age || '',
        dob: member.dob || '',
        address: member.address || '',
        state: member.state || '',
        country: member.country || '',
        email: member.email || '',
        emergency_contact: member.emergency_contact || '',
        emergency_phone: member.emergency_phone || '',
        membership_type: member.membership_type || '',
        medications: member.medications || '',
        allergies: member.allergies || '',
        past_injuries: member.past_injuries || '',
        medical_conditions: member.medical_conditions || '',
        medical_contact: member.medical_contact || '',
        medical_contact_phone: member.medical_contact_phone || '',
        other_info: member.other_info || '',
        payment_type: member.payment_type || ''
      };
      this.view = 'form';
      this.message = `Editing member #${member.id}`;
    },

    // Delete a single member from the list.
    deleteMember(id) {
      if (!confirm('Are you sure you want to delete this member?')) {
        return;
      }
      axios.delete(`${apiBase}/members/${id}`)
        .then(() => {
          this.message = 'Member deleted.';
          this.fetchMembers();
        })
        .catch(err => {
          console.error('Error deleting member:', err);
          this.message = 'Error deleting member.';
        });
    },

    // Toggle a single checkbox in the list.
    toggleSelection(id) {
      const idx = this.selected.indexOf(id);
      if (idx === -1) {
        this.selected.push(id);
      } else {
        this.selected.splice(idx, 1);
      }
      // keep selectAll flag in sync in a simple way
      this.selectAll = this.selected.length === this.members.length;
    },

    // Handle the "select all" checkbox.
    toggleSelectAll() {
      if (this.selectAll) {
        // if it was just checked, select all ids
        this.selected = this.members.map(m => m.id);
      } else {
        // if it was unchecked, clear all selection
        this.selected = [];
      }
    },

    // Delete all checked members.
    deleteSelected() {
      if (this.selected.length === 0) {
        this.message = 'No members selected to delete.';
        return;
      }
      if (!confirm(`Delete ${this.selected.length} selected member(s)?`)) {
        return;
      }

      const promises = this.selected.map(id =>
        axios.delete(`${apiBase}/members/${id}`)
      );

      Promise.all(promises)
        .then(() => {
          this.message = 'Selected members deleted.';
          this.fetchMembers();
          this.selected = [];
          this.selectAll = false;
        })
        .catch(err => {
          console.error('Error deleting selected members:', err);
          this.message = 'Error deleting selected members.';
        });
    }
  },

  // Replace the placeholder template.
  template: `
    <div class="container py-4">
      <div class="page-box">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 class="mb-1">Gym Membership Management</h1>
            <p class="text-muted mb-0">Vue + Bootstrap frontend with Express + SQLite backend</p>
          </div>
          <div>
            <button class="btn btn-primary me-2" @click="setView('home')">Home</button>
            <button class="btn btn-primary me-2" @click="() => { resetForm(); setView('form'); }">New Application</button>
            <button class="btn btn-primary" @click="setView('list')">View Members</button>
          </div>
        </div>

        <div v-if="message" class="alert alert-info">
          {{ message }}
        </div>

        <!-- Home view -->
        <div v-if="view === 'home'">
          <p>
            This project that lets an admin
            capture gym membership applications and manage them in a simple list.
          </p>
          <p>
            Use the buttons above to start a new application or review existing members.
          </p>
        </div>

        <!-- Form view -->
        <div v-else-if="view === 'form'">
          <h3 class="mb-3">{{ editingId ? 'Edit Member' : 'New Membership Application' }}</h3>

          <form @submit.prevent="saveMember">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-control" v-model="form.name" />
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">Sex</label>
                <select class="form-select" v-model="form.sex">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">Age</label>
                <input type="number" class="form-control" v-model="form.age" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Date of Birth</label>
                <input type="date" class="form-control" v-model="form.dob" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-8 mb-3">
                <label class="form-label">Address</label>
                <input type="text" class="form-control" v-model="form.address" />
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">State</label>
                <input type="text" class="form-control" v-model="form.state" />
              </div>
              <div class="col-md-2 mb-3">
                <label class="form-label">Country</label>
                <input type="text" class="form-control" v-model="form.country" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" v-model="form.email" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Emergency Contact</label>
                <input type="text" class="form-control" v-model="form.emergency_contact" />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Emergency Phone</label>
                <input type="text" class="form-control" v-model="form.emergency_phone" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Membership Type *</label>
                <select class="form-select" v-model="form.membership_type">
                  <option value="">Select...</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Payment Type</label>
                <select class="form-select" v-model="form.payment_type">
                  <option value="">Select...</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Current Medications</label>
              <textarea class="form-control" rows="2" v-model="form.medications"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Allergies</label>
              <textarea class="form-control" rows="2" v-model="form.allergies"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Past Injuries</label>
              <textarea class="form-control" rows="2" v-model="form.past_injuries"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Current Medical Conditions</label>
              <textarea class="form-control" rows="2" v-model="form.medical_conditions"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Medical Contact</label>
              <input type="text" class="form-control" v-model="form.medical_contact" />
            </div>
            <div class="mb-3">
              <label class="form-label">Medical Contact Phone</label>
              <input type="text" class="form-control" v-model="form.medical_contact_phone" />
            </div>
            <div class="mb-3">
              <label class="form-label">Other Info</label>
              <textarea class="form-control" rows="2" v-model="form.other_info"></textarea>
            </div>

            <div class="mt-3">
              <button type="submit" class="btn btn-success me-2">
                {{ editingId ? 'Update Member' : 'Save Member' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="resetForm">
                Clear Form
              </button>
            </div>
          </form>
        </div>

        <!-- List view -->
        <div v-else-if="view === 'list'">
          <h3 class="mb-3">Member List</h3>

          <div class="mb-2 d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              <span class="ms-1">Select All</span>
            </div>
            <button class="btn btn-danger btn-sm" @click="deleteSelected">
              Delete Selected
            </button>
          </div>

          <div v-if="members.length === 0" class="text-muted">
            No members found.
          </div>

          <table v-else class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th style="width: 40px;"></th>
                <th>Name</th>
                <th>Membership</th>
                <th>Email</th>
                <th>Emergency Contact</th>
                <th>Country</th>
                <th style="width: 160px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in members" :key="m.id">
                <td>
                  <input
                    type="checkbox"
                    :value="m.id"
                    :checked="selected.includes(m.id)"
                    @change="toggleSelection(m.id)"
                  />
                </td>
                <td>{{ m.name }}</td>
                <td>{{ m.membership_type }}</td>
                <td>{{ m.email }}</td>
                <td>{{ m.emergency_contact }}</td>
                <td>{{ m.country }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editMember(m)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteMember(m.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
});

app.mount('#app');