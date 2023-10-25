<template>
    <div>
      <!-- Поле для пошуку за прізвищем -->
      <input type="text" id="search-input" v-model="search" placeholder="Пошук за прізвищем">
  
      <!-- Форма для додавання нового студента -->
      <form @submit.prevent="addStudent" class="form-fields">
        <label for="newStudentPhoto">Фото:</label>
        <input type="url" id="newStudentPhoto" v-model="newStudent.photo" placeholder="Фото">
        <label for="newStudentName">ПІБ:</label>
        <input type="text" id="newStudentName" v-model="newStudent.name" placeholder="ПІБ" required>
        <label for="newStudentGroup">Група:</label>
        <select id="newStudentGroup" v-model="newStudent.group">
          <option value="RPZ 20 1/9">RPZ 20 1/9</option>
          <option value="RPZ 20 2/9">RPZ 20 2/9</option>
        </select>
        <label for="newStudentMark">Оцінка:</label>
        <input type="number" id="newStudentMark" v-model="newStudent.mark" placeholder="Оцінка" required>
        <label for="newStudentIsDonePr">Практика:</label>
        <input type="checkbox" id="newStudentIsDonePr" v-model="newStudent.isDonePr">
        <button type="submit">Додати</button>
      </form>
  
      <!-- Форма для редагування вибраного студента -->
      <div v-if="selectedStudent" class="form-fields">
        <label for="editStudentPhoto">Фото:</label>
        <input type="url" id="editStudentPhoto" v-model="selectedStudent.photo" placeholder="Фото">
        <label for="editStudentName">ПІБ:</label>
        <input type="text" id="editStudentName" v-model="selectedStudent.name" placeholder="ПІБ" required>
        <label for="editStudentGroup">Група:</label>
        <select id="editStudentGroup" v-model="selectedStudent.group">
          <option value="RPZ 20 1/9">RPZ 20 1/9</option>
          <option value="RPZ 20 2/9">RPZ 20 2/9</option>
        </select>
        <label for="editStudentMark">Оцінка:</label>
        <input type="number" id="editStudentMark" v-model="selectedStudent.mark" placeholder="Оцінка" required>
        <label for="editStudentIsDonePr">Практика:</label>
        <input type="checkbox" id="editStudentIsDonePr" v-model="selectedStudent.isDonePr">
        <button @click="saveEditedStudent">Зберегти</button>
      </div>
  
      <!-- Таблиця зі списком студентів -->
      <table>
        <thead>
          <tr>
            <th>Фото</th>
            <th>ПІБ</th>
            <th>Група</th>
            <th>Оцінка</th>
            <th>Практика</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student._id">
          <td>
            <a @click="openModal(student)">
            <img v-if="student.photo" :src="student.photo" alt="Фото студента" width="50">
          </a>
          </td>
          <td>
            <router-link :to="'/student-info/' + student._id">{{ student.name }}</router-link>
          </td>
            <td>
              <span :class="{ 'highlighted-text': student.nameIsHighlighted }"></span>
            </td>
            <td>
              <span :class="{ 'highlighted-text': student.groupIsHighlighted }">{{ student.group }}</span>
            </td>
            <td>
              <span :class="{ 'highlighted-text': student.markIsHighlighted }">{{ student.mark }}</span>
            </td>
            <td>
              <input type="checkbox" :checked="student.isDonePr" @change="updateIsDonePr(student)">
            </td>
            <td>
              <a @click="removeStudent(student._id)" href="#">Видалити</a>
              <a @click="toggleEditing(student)" href="#">
                <i class="fas fa-edit"></i> Редагувати
              </a>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Модальне вікно для відображення інформації про студента -->
      <div class="modal" v-if="isModalOpen" @click="closeModal">
        <div class="modal-content" @click.stop>
          <img :src="selectedStudent.photo" alt="Фото студента">
          <h2>{{ selectedStudent.name }}</h2>
          <p>Група: {{ selectedStudent.group }}</p>
          <p>Оцінка: {{ selectedStudent.mark }}</p>
          <p>Практика: {{ selectedStudent.isDonePr ? 'Завершена' : 'Не завершена' }}</p>
          <button @click="closeModal">Закрити</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        apiBaseUrl: 'http://34.82.81.113:3000',
        students: [],
        search: '',
        newStudent: {
          name: '',
          group: '',
          mark: null,
          isDonePr: false,
          photo: '',
        },
        selectedStudent: null,
        isModalOpen: false,
      };
    },
    created() {
      this.fetchStudents();
    },
    computed: {
      filteredStudents() {
        const searchTerm = this.search.toLowerCase();
        return this.students.map((student) => ({
          ...student,
          nameIsHighlighted: searchTerm && student.name.toLowerCase().includes(searchTerm),
          groupIsHighlighted: searchTerm && student.group.toLowerCase().includes(searchTerm),
        }));
      },
    },
    methods: {
      async fetchStudents() {
        try {
          const response = await axios.get(`${this.apiBaseUrl}/students`);
          this.students = response.data;
        } catch (error) {
          console.error('Помилка при завантаженні студентів:', error);
        }
      },
      removeStudent(id) {
        axios
          .delete(`${this.apiBaseUrl}/students/${id}`)
          .then(() => {
            const index = this.students.findIndex((student) => student._id === id);
            if (index !== -1) {
              this.students.splice(index, 1);
            }
          })
          .catch((error) => {
            console.error('Помилка при видаленні студента:', error);
          });
      },
      addStudent() {
        axios
          .post(`${this.apiBaseUrl}/students`, this.newStudent)
          .then((response) => {
            this.students.push(response.data);
            this.newStudent = {
              name: '',
              group: '',
              mark: null,
              isDonePr: false,
              photo: '',
            };
          })
          .catch((error) => {
            console.error('Помилка при додаванні студента:', error);
          });
      },
      updateIsDonePr(student) {
        const apiUrl = `${this.apiBaseUrl}/students/${student._id}`;
        const data = { isDonePr: student.isDonePr };
        axios
          .put(apiUrl, data)
          .then(() => {
            console.log('isDonePr успішно оновлено');
          })
          .catch((error) => {
            console.error('Помилка при оновленні isDonePr', error);
          });
      },
      toggleEditing(student) {
        this.selectedStudent = { ...student };
      },
      saveEditedStudent() {
        if (this.selectedStudent) {
          axios
            .put(`${this.apiBaseUrl}/students/${this.selectedStudent._id}`, this.selectedStudent)
            .then((response) => {
              const updatedStudent = response.data;
              const index = this.students.findIndex((student) => student._id === updatedStudent._id);
              if (index !== -1) {
                this.students[index] = updatedStudent;
              }
              this.selectedStudent = null;
            })
            .catch((error) => {
              console.error('Помилка при збереженні студента:', error);
            });
        }
      },
      openModal(student) {
        this.selectedStudent = student;
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
      },
    },
  };
  </script>
  