<script setup>
import { ref } from 'vue'
import axios from "axios";

const loading = ref(false);
const message = ref("");

const handleFileUpload = async (e) => {
  loading.value = true;
  const file = e.target.files[0];

  const reader = new FileReader();
  // reader.onload = (e) => {
  //   this.imageData = e.target.result; // Data URL for preview
  // };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('photo', file);

  // TODO error handle & make dynamic
  const response = await axios.post('http://localhost:8080/upload', formData);

  message.value = `Is Photo Hot Dog: ${response.data.isHotDog}`;

  loading.value = false;


  // const reader = new FileReader();
  // reader.readAsDataURL(file);
  //
  // console.log(files);
  // console.log(e.target.files[0]);
}
</script>

<template>
  <div class="card">
    <input
        style="padding-bottom: 15px"
        type="file"
        id="media"
        :disabled="loading"
        accept="image/*"
        multiple
        @change="(event) => handleFileUpload(event)"
    />
    <br/>
    <div v-show="loading" class="loader"></div>
    <p v-show="!loading">
      {{ message }}
    </p>
  </div>

</template>

<style scoped>
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
