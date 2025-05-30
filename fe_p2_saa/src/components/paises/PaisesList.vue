<script setup lang="ts">
import type { Paises } from '@/models/paises'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'paises'
const paises = ref<Paises[]>([])
const emit = defineEmits(['edit'])
const paisesDelete = ref<Paises | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  paises.value = await http.get(ENDPOINT).then((res) => res.data)
}

const paisesFiltrados = computed(() =>
  paises.value.filter((paises) =>
    paises.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()),
  ),
)

function mostrarEliminarConfirm(p: Paises) {
  paisesDelete.value = p
  mostrarConfirmDialog.value = true
}

function emitirEdicion(p: Paises) {
  emit('edit', p)
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${paisesDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" placeholder="Buscar por descripción" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(paises, index) in paisesFiltrados" :key="paises.id">
          <td>{{ index + 1 }}</td>
          <td>{{ paises.descripcion }}</td>
          <td>
            <Button icon="pi pi-pencil" text @click="emitirEdicion(paises)" />
            <Button
              icon="pi pi-trash"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(paises)"
            />
          </td>
        </tr>
        <tr v-if="paisesFiltrados.length === 0">
          <td colspan="3">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
