
export function formatDate(inputDate: string): string {
    const [day, month, year ] = inputDate.split("/");
    return `${year}-${month}-${day}`;
  }

  export function capitalizeFirstLetter(input: string): string {
    if (!input) return input; // Verifica se a string não está vazia
  
    // Substitui todos os sublinhados por espaços
    const formattedInput = input.replace(/_/g, ' ');
  
    // Capitaliza a primeira letra e transforma o restante em minúsculas
    return formattedInput.charAt(0).toUpperCase() + formattedInput.slice(1).toLowerCase();
  }

  export function formatCurrencyBR(input: number | undefined): string {
    if (input === undefined) {
      return "R$ 0,00";
    }
  
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(input);
  }

  export function formatDateBr(dataISO: string): string {
    if (!dataISO) {
      return "--";
    }
  
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
  
    return `${dia}/${mes}/${ano}`;
  }