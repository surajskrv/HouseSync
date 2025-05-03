export default {
    template: `
      <div>
        <p>Logging out</p>
      </div>
    `,
    mounted() {
      this.logoutUser();
    },
    methods: {
      logoutUser() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        this.$emit('logout');
        this.$router.push('/login');
      },
    },
  };