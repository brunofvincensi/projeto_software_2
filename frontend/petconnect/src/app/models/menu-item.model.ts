export interface MenuItem {
  title: string;       // Nome exibido no menu (ex: "Dashboard")
  icon: string;        // Ícone do Material (ex: "dashboard")
  path: string;        // Rota (ex: "/dashboard")
  isActive?: boolean;  // Se o item está ativo (gerado dinamicamente)
  children?: {        // Subitens (opcional)
    title: string;
    path: string; 
    isActive?: boolean;
  }[];
}
