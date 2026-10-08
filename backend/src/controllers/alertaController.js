import { Alerta, CalendarioICal, EmailReserva } from '../models/index.js';
import {
  verificarSaudeSincronia,
  verificarSaudeTodas,
  verificarBloqueiosManuaisPendentes,
  listarAlertas,
  resolverAlerta,
  sincronizarSaude,
  statsDashboard
} from '../services/alertaService.js';

export { listarAlertas, resolverAlerta, sincronizarSaude, statsDashboard, verificarBloqueiosManuaisPendentes };