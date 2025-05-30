<script setup lang="ts">
import PaisesList from '@/components/paises/PaisesList.vue'
import PaisesSave from '@/components/paises/PaisesSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const paisesListRef = ref<typeof PaisesList | null>(null)
const paisesEdit = ref<any>(null)

function handleCreate() {
  paisesEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(artista: any) {
  paisesEdit.value = artista
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  paisesListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Paises</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <PaisesList ref="paisesListRef" @edit="handleEdit" />
    <PaisesSave
      :mostrar="mostrarDialog"
      :paises="paisesEdit"
      :modoEdicion="!!paisesEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
