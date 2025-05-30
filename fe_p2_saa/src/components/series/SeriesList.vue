<script setup lang="ts">
import type { Series } from '@/models/series'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'series'
const series = ref<Series[]>([])
const emit = defineEmits(['edit'])
const seriesDelete = ref<Series | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  series.value = await http.get(ENDPOINT).then((res) => res.data)
}
const seriesFiltrados = computed(() =>
  series.value.filter(
    (serie) =>
      serie.paises?.descripcion?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.sinopsis.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.director.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.temporadas.toString().includes(busqueda.value.toLowerCase()),
  ),
)

function emitirEdicion(serie: Series) {
  emit('edit', serie)
}

function mostrarEliminarConfirm(serie: Series) {
  seriesDelete.value = serie
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${seriesDelete.value?.id}`)
  await obtenerLista()
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre" />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="seriesFiltrados"
        paginator
        scrollable
        scrollHeight="flex"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
      >
        <Column field="series.paises" header="Paises" sortable style="min-width: 100px"></Column>
        <Column field="titulo" header="Titulo" sortable style="min-width: 100px"></Column>
        <Column field="sinopsis" header="Sinopsis" sortable style="min-width: 100px"></Column>
        <Column field="director" header="Director" style="min-width: 100px"></Column>
        <Column field="temporadas" header="Temporadas" style="min-width: 100px"></Column>
        <Column field="fechasEstrenos" header="FechasEstrenos" style="min-width: 100px"></Column>
        <Column
          field="tipoClasificacion"
          header="TipoClasificacion"
          style="min-width: 100px"
        ></Column>
        <Column header="Acciones" frozen alignFrozen="right" style="min-width: 120px">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <table class="table mt-3">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Numero País</th>
          <th>Título</th>
          <th>Sinopsis</th>
          <th>Director</th>
          <th>Temporadas</th>
          <th>Fecha de Estreno</th>
          <th>Tipo de Clasificacion</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(serie, index) in seriesFiltrados" :key="serie.id">
          <td>{{ index + 1 }}</td>
          <td>{{ serie.paises?.descripcion || '—' }}</td>
          <td>{{ serie.titulo }}</td>
          <td>{{ serie.sinopsis }}</td>
          <td>{{ serie.director }}</td>
          <td>{{ serie.temporadas }}</td>
          <td>{{ serie.tipoClasificacion }}</td>
          <td>{{ new Date(serie.fechasEstreno).toLocaleDateString() }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(serie)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(serie)"
            />
          </td>
        </tr>
        <tr v-if="seriesFiltrados.length === 0">
          <td colspan="8">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2 mt-3">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
