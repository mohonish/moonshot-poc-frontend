<template>
  <div class="home">
    <img class="logo" alt="Vue logo" src="../assets/moonshot_logo_compressed.png">
    <div class="content">
      <h1>Moonranger Ground Control System</h1>
      <p>ACDM Experiment <a href="https://mse-moonshot.atlassian.net/browse/MS-219">MS-219</a> to demonstrate feasibility of chosen tech stack.</p>
      <p><b>Frontend:</b> Vue.js and AMCharts</p>
      <p><b>Backend:</b> Go service with TimescaleDB over PostgreSQL</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home'
}
</script>

<style scoped>
  .logo {
    height: 220px;
  }
</style>
