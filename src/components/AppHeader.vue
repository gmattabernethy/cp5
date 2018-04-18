<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Gleb's Russian Watches</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      <li class="right" v-if="loggedIn"><a @click="logout" href="#">Logout</a></li>
      <li class="right" v-if="loggedIn">{{user.username}}</li>
      
    </ul>
	<form v-else class="right" v-on:submit.prevent="login">
		<input v-model="email" placeholder="Email Address">
		<input v-model="password" placeholder="Password">
		<button class="primary" type="submit">Login</button>
	      </form>
	<div class="flexWrapper errorPlace">
	      <p v-if="loginError" class="flexRight error">{{loginError}}</p>
	    </div>	

  </div>
</nav>
</template>
