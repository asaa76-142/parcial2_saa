<script setup lang="ts">
import SeriesList from '@/components/series/SeriesList.vue'
import SeriesSave from '@/components/series/SeriesSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const seriesListRef = ref<typeof SeriesList | null>(null)
const seriesEdit = ref<any>(null)

function handleCreate() {
  seriesEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(series: any) {
  seriesEdit.value = series
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  seriesListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Series</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" class="col-3" />
    <SeriesList ref="seriesListRef" @edit="handleEdit" />
    <SeriesSave
      :mostrar="mostrarDialog"
      :series="seriesEdit"
      :modoEdicion="!!seriesEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
