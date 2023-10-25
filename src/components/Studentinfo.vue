<template>
    <div class="student-profile">
      <div class="student-info">
        <h2>{{ student.name }}</h2>
        <img :src="student.photo" :alt="student.name" class="student-photo">
      </div>
      <div class="student-details">
        <p><strong>Група:</strong> {{ student.group }}</p>
        <p><strong>Оцінка:</strong> {{ student.mark }}</p>
        <p><strong>Практика:</strong> {{ student.isDonePr ? 'Завершена' : 'Не завершена' }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: {
      id: '',
    },
    data() {
      return {
        student: {},
      };
    },
    mounted: function () {
      axios.get("http://34.82.81.113:3000/students/" + this.id).then((response) => {
        this.student = response.data;
      })
    }
  }
  </script>
  