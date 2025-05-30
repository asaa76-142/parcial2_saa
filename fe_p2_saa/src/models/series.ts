import type { Paises } from './paises'

export interface Series {
  id: number
  idPais: Paises
  titulo: string
  sinopsis: string
  director: string
  temporadas: number
  fechasEstreno: string | Date
  tipoClasificacion: string
}
