<template>
  <div class="container">
    <div class="tr">
      <RouterView name="head"></RouterView>
    </div>
    <div class="tr" style="flex-grow:1;">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script>

export default {
  name: "",
  data: function() {
    return {};
  },
  methods: {
    logout: function() {
      window.sessionStorage.removeItem("userName");
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  width: 100%;
  height: 100%;
}

.tr {
  width: 100%;

  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  /* background-color: beige; */
  /* align-items: center; */

}

.second {
  background-color: aqua;
}

.td {
  display: flex;
  flex-basis: 100px;
  flex-direction: column;

}
</style>
<style>
html,
body,
#app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>