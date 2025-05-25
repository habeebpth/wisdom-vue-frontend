<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-20 w-auto" src="/images/wisdom_logo.jpg" alt="Wisdom House Logo" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {{ error }}
        </div>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="form.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Loading spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Lock icon -->
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
        
        <div class="text-center">
          <a @click="showRegisterModal = true" class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
            Register new admin?
          </a>
        </div>
      </form>
    </div>
    
    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <!-- User icon -->
                <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Register New Admin
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="register">
                    <div v-if="registerError" class="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                      {{ registerError }}
                    </div>
                    <div class="mb-4">
                      <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="name" id="name" v-model="registerForm.name" required
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div class="mb-4">
                      <label for="register-email" class="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="register-email" id="register-email" v-model="registerForm.email" required
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div class="mb-4">
                      <label for="register-password" class="block text-sm font-medium text-gray-700">Password</label>
                      <input type="password" name="register-password" id="register-password" v-model="registerForm.password" required
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div class="mb-4">
                      <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                      <input type="password" name="password_confirmation" id="password_confirmation" v-model="registerForm.password_confirmation" required
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div class="mb-4">
                      <label for="admin_secret" class="block text-sm font-medium text-gray-700">Admin Secret</label>
                      <input type="password" name="admin_secret" id="admin_secret" v-model="registerForm.admin_secret" required
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="registering"
              @click="register"
            >
              {{ registering ? 'Registering...' : 'Register' }}
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showRegisterModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminLogin',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: null,
      showRegisterModal: false,
      registerForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_secret: '',
      },
      registering: false,
      registerError: null
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/admin/login', this.form);
        
        if (response.data.success) {
          // Store the token
          localStorage.setItem('admin_token', response.data.access_token);
          localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
          
          // Redirect to admin dashboard
          this.$router.push({ name: 'AdminDashboard' });
        } else {
          this.error = response.data.message || 'Login failed';
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Invalid credentials';
      } finally {
        this.loading = false;
      }
    },
    async register() {
      this.registering = true;
      this.registerError = null;
      
      // Check if passwords match
      if (this.registerForm.password !== this.registerForm.password_confirmation) {
        this.registerError = 'Passwords do not match';
        this.registering = false;
        return;
      }
      
      try {
        const response = await axios.post('/api/admin/register', this.registerForm);
        
        if (response.data.success) {
          // Close modal and show success message
          this.showRegisterModal = false;
          alert('Registration successful! You can now login.');
          
          // Reset registration form
          this.registerForm = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            admin_secret: '',
          };
        } else {
          this.registerError = response.data.message || 'Registration failed';
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          // Get first error message
          this.registerError = Object.values(errors)[0][0] || 'Registration failed';
        } else {
          this.registerError = error.response?.data?.message || 'Registration failed';
        }
      } finally {
        this.registering = false;
      }
    }
  }
};
</script>