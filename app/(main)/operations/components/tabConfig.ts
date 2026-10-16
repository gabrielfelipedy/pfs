import { createSaida } from "@/actions/expense-actions";
import { createEntrada } from "@/actions/income-actions";

export type OperationTab = "saidas" | "entradas";

export interface OperationTabConfig {
  isIncome: boolean;
  title: string;
  createAction: typeof createSaida;
  emptyOperation: {
    name: string;
    value: number;
    parcelas: number;
    is_income: boolean;
  };
  heatmap: {
    title: string;
    description: string;
    valueLabel: string;
    colorRange: { light: string[]; dark: string[] };
  };
  resume: {
    monthly: { title: string; subtext: string };
    weekly: { title: string; subtext: string };
    daily: { title: string; subtext: string };
  };
  charts: {
    categoryTitle: string;
    paymentMethodTitle: string;
    evolutionTitle: string;
    lineChartColor?: string;
    categoryDrillPrefix: string;
    paymentMethodDrillPrefix: string;
  };
  addOperation: {
    openDialogText: string;
    dialogTitle: string;
    dialogDescription: string;
    buttonText: string;
  };
  fixed: {
    sectionTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyCreateButtonText: string;
    createDialog: {
      openDialogText: string;
      dialogTitle: string;
      dialogDescription: string;
      buttonText: string;
    };
  };
  variable: {
    sectionTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyCreateButtonText: string;
    createDialog: {
      openDialogText: string;
      dialogTitle: string;
      dialogDescription: string;
      buttonText: string;
    };
  };
  importButtonText: string;
}

export const operationsTabConfig: Record<OperationTab, OperationTabConfig> = {
  saidas: {
    isIncome: false,
    title: "Saídas",
    createAction: createSaida,
    emptyOperation: {
      name: "",
      value: 0,
      parcelas: 1,
      is_income: false,
    },
    heatmap: {
      title: "Saídas",
      description: "Total de gastos ao longo do ano",
      valueLabel: "Gastos",
      colorRange: {
        light: ["#fee2e2", "#f5a3a3", "#e84040", "#c02020", "#a01010"],
        dark: ["#2b1020", "#7a1a1a", "#b53030", "#e83030", "#ff4040"],
      },
    },
    resume: {
      monthly: { title: "Gastos mensais", subtext: "Total de gastos no mês" },
      weekly: { title: "Gastos semanais", subtext: "Total de saídas registradas" },
      daily: { title: "Gastos diários", subtext: "Total de saídas registradas" },
    },
    charts: {
      categoryTitle: "Gastos por categoria",
      paymentMethodTitle: "Gastos por método de pagamento",
      evolutionTitle: "Evolução de gastos",
      lineChartColor: "#FF5454",
      categoryDrillPrefix: "Gastos em",
      paymentMethodDrillPrefix: "Gastos por",
    },
    addOperation: {
      openDialogText: "Adicionar Gasto",
      dialogTitle: "Adicionar Gasto",
      dialogDescription: "Preencha as informações do gasto",
      buttonText: "Adicionar",
    },
    fixed: {
      sectionTitle: "Gastos fixos",
      emptyTitle: "Sem Gastos Fixos",
      emptyDescription:
        "Você ainda não criou nenhum gasto fixo. Comece criando seu primeiro gasto fixo",
      emptyCreateButtonText: "Criar Gasto Fixo",
      createDialog: {
        openDialogText: "Criar Gasto Fixo",
        dialogTitle: "Adicionar Gasto",
        dialogDescription: "Preencha as informações do gasto",
        buttonText: "Adicionar",
      },
    },
    variable: {
      sectionTitle: "Gastos variáveis",
      emptyTitle: "Sem Gastos Variáveis",
      emptyDescription: "Você ainda não criou nenhum gasto variável neste mês.",
      emptyCreateButtonText: "Criar Gasto",
      createDialog: {
        openDialogText: "Criar Gasto",
        dialogTitle: "Adicionar Gasto",
        dialogDescription: "Preencha as informações do gasto",
        buttonText: "Adicionar",
      },
    },
    importButtonText: "Importar de CSV",
  },
  entradas: {
    isIncome: true,
    title: "Entradas",
    createAction: createEntrada,
    emptyOperation: {
      name: "",
      value: 0,
      parcelas: 1,
      is_income: true,
    },
    heatmap: {
      title: "Entradas",
      description: "Total de entradas ao longo do ano",
      valueLabel: "Entradas",
      colorRange: {
        light: ["#dcfce7", "#86efac", "#4ade80", "#22c55e", "#16a34a"],
        dark: ["#052e16", "#14532d", "#166534", "#15803d", "#22c55e"],
      },
    },
    resume: {
      monthly: { title: "Entradas mensais", subtext: "Total de entradas no mês" },
      weekly: { title: "Entradas semanais", subtext: "Total de entradas registradas" },
      daily: { title: "Entradas diárias", subtext: "Total de entradas registradas" },
    },
    charts: {
      categoryTitle: "Entradas por categoria",
      paymentMethodTitle: "Entradas por método de pagamento",
      evolutionTitle: "Evolução de entradas",
      categoryDrillPrefix: "Entradas em",
      paymentMethodDrillPrefix: "Entradas por",
    },
    addOperation: {
      openDialogText: "Adicionar entrada",
      dialogTitle: "Adicionar entrada",
      dialogDescription: "Preencha as informações da entrada",
      buttonText: "Adicionar",
    },
    fixed: {
      sectionTitle: "Entradas fixas",
      emptyTitle: "Sem Entradas Fixas",
      emptyDescription:
        "Você ainda não criou nenhuma entrada fixa. Comece criando sua primeira entrada",
      emptyCreateButtonText: "Criar Entrada Fixo",
      createDialog: {
        openDialogText: "Criar Entrada Fixo",
        dialogTitle: "Adicionar entrada",
        dialogDescription: "Preencha as informações da entrada",
        buttonText: "Adicionar",
      },
    },
    variable: {
      sectionTitle: "Entradas variáveis",
      emptyTitle: "Sem Entradas Variáveis",
      emptyDescription: "Você ainda não criou nenhuma entrada variável neste mês.",
      emptyCreateButtonText: "Criar Entrada",
      createDialog: {
        openDialogText: "Criar Entrada",
        dialogTitle: "Adicionar entrada",
        dialogDescription: "Preencha as informações da entrada",
        buttonText: "Adicionar",
      },
    },
    importButtonText: "Importar de CSV",
  },
};
