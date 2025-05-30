<script setup lang="ts">
import type { Series } from '@/models/series'
import type { Paises } from '@/models/paises'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'series'

const props = defineProps<{
  mostrar: boolean
  series: Series
  modoEdicion: boolean
}>()

const emit = defineEmits<{
  (e: 'guardar'): void
  (e: 'close'): void
}>()

const serieActual = ref<Series>({ ...props.series })
const paises = ref<Paises[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

watch(
  () => props.series,
  (newVal) => {
    serieActual.value = { ...newVal }
  },
)

async function obtenerSerie() {
  if (props.modoEdicion && props.series?.id) {
    const res = await http.get(`${ENDPOINT}/${props.series.id}`)
    serieActual.value = res.data
  }
}

watch(
  () => props.mostrar,
  (val) => {
    if (val) obtenerSerie()
  },
)
async function obtenerPaises() {
  paises.value = await http.get('paises').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      paises: serieActual.value.paises.descripcion,
      titulo: serieActual.value.titulo,
      sinopsis: serieActual.value.sinopsis,
      director: serieActual.value.director,
      temporadas: serieActual.value.temporadas,
      fechasEstreno: serieActual.value.fechasEstreno,
      tipoClasificacion: serieActual.value.tipoClasificacion,
    }

    if (props.modoEdicion && serieActual.value.id) {
      await http.patch(`${ENDPOINT}/${serieActual.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    serieActual.value = {} as Series
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar')
  }
}
watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerPaises()
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="paises" class="font-semibold w-3">País</label>
        <Dropdown
          id="paises"
          v-model="serieActual.paises"
          :options="paises"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-24">Título</label>
        <InputText
          id="titulo"
          v-model="serieActual.titulo"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sinopsis" class="font-semibold w-24">Sinopsis</label>
        <InputText
          id="sinopsis"
          v-model="serieActual.sinopsis"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="director" class="font-semibold w-24">Director</label>
        <InputText
          id="director"
          v-model="serieActual.director"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-24">Temporada</label>
        <InputText
          id="temporadas"
          v-model="serieActual.temporadas"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechasEstreno" class="font-semibold w-24">Fechas Estreno</label>
        <InputText
          id="fechasEstreno"
          v-model="serieActual.fechasEstreno"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tipoClasificacion" class="font-semibold w-24">Tipo de Clasificacion</label>
        <Dropdown
          id="tipoClasificacion"
          v-model="serieActual.tipoClasificacion"
          :options="tipoClasificacion"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-24">Temporadas</label>
        <InputNumber id="temporadas" v-model="serieActual.temporadas" class="flex-auto" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
