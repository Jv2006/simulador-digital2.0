// ============================================================
// CONFIGURAÇÃO — é AQUI que você mexe quando precisar atualizar
// ============================================================

// Seu WhatsApp com DDI + DDD + número, só números. Ex.: 5521999999999
const WHATSAPP = "5521967589625"; // <- TROQUE pelo número real

// Fatores da sua planilha (coluna da direita).
// Regra: valor final = valor no Pix ÷ fator, arredondado para o R$ 0,25 mais próximo.
// Para atualizar uma taxa, troque só o número do "fator" da linha.
const OPCOES = [
  { rotulo: "Débito à vista",  parcelas: 1,  fator: 0.9804881 },
  { rotulo: "Crédito à vista", parcelas: 1,  fator: 0.9525623 },
  { rotulo: "2x",              parcelas: 2,  fator: 0.9120758 },
  { rotulo: "3x",              parcelas: 3,  fator: 0.8990380 },
  { rotulo: "4x",              parcelas: 4,  fator: 0.8979885 },
  { rotulo: "5x",              parcelas: 5,  fator: 0.8748141 },
  { rotulo: "6x",              parcelas: 6,  fator: 0.8747375 },
  { rotulo: "7x",              parcelas: 7,  fator: 0.8567511 },
  { rotulo: "8x",              parcelas: 8,  fator: 0.8566778 },
  { rotulo: "9x",              parcelas: 9,  fator: 0.8354916 },
  { rotulo: "10x",             parcelas: 10, fator: 0.8288437 },
  { rotulo: "11x",             parcelas: 11, fator: 0.8287750 },
  { rotulo: "12x",             parcelas: 12, fator: 0.8189337 },
  { rotulo: "13x",             parcelas: 13, fator: 0.8127438 },
  { rotulo: "14x",             parcelas: 14, fator: 0.8035359 },
  { rotulo: "15x",             parcelas: 15, fator: 0.7947230 },
  { rotulo: "16x",             parcelas: 16, fator: 0.7861639 },
  { rotulo: "17x",             parcelas: 17, fator: 0.7777259 },
  { rotulo: "18x",             parcelas: 18, fator: 0.7692899 }
];

// Opção que já vem selecionada (posição na lista acima: 12 = "12x")
const OPCAO_INICIAL = 12;

// ============================================================
// CÓDIGO DO SIMULADOR (não precisa mexer daqui para baixo)
// ============================================================

const campoValor = document.getElementById("valor");
const selectParcelas = document.getElementById("parcelas");
const erro = document.getElementById("erro");
const resultado = document.getElementById("resultado");
const tabelaBox = document.getElementById("tabela-box");
const tabela = document.getElementById("tabela");
const resDestaque = document.getElementById("res-destaque");
const resTotal = document.getElementById("res-total");
const btnWhats = document.getElementById("btn-whats");

const formatoReal = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

// Converte o texto digitado ("2.500,00" ou "2500.50") em número
function lerValor(texto) {
  let t = texto.trim().replace(/[^\d.,]/g, "");
  if (t.includes(",")) {
    t = t.replace(/\./g, "").replace(",", ".");
  }
  const numero = parseFloat(t);
  return isNaN(numero) ? 0 : numero;
}

// Calcula total e parcela de uma opção a partir do valor no Pix
function calcular(valorPix, opcao) {
  const total = Math.round((valorPix / opcao.fator) * 4) / 4; // múltiplo de R$ 0,25
  const parcela = Math.round((total / opcao.parcelas) * 100) / 100;
  return { parcela, total };
}

// Preenche o select com todas as opções
function montarSelect() {
  OPCOES.forEach((opcao, i) => {
    const item = document.createElement("option");
    item.value = i;
    item.textContent = opcao.rotulo;
    selectParcelas.appendChild(item);
  });
  selectParcelas.value = String(OPCAO_INICIAL);
}

// Atualiza tudo na tela
function atualizar() {
  const texto = campoValor.value.trim();
  const valorPix = lerValor(texto);
  const indice = parseInt(selectParcelas.value, 10);
  const opcao = OPCOES[indice];

  if (texto === "" || valorPix <= 0) {
    if (texto === "") {
      erro.hidden = true;
    } else {
      erro.textContent = "Digite um valor maior que zero.";
      erro.hidden = false;
    }
    resultado.hidden = true;
    tabelaBox.hidden = true;
    return;
  }

  erro.hidden = true;

  const { parcela, total } = calcular(valorPix, opcao);

  if (opcao.parcelas === 1) {
    resDestaque.innerHTML = opcao.rotulo + ": <strong>" + formatoReal.format(total) + "</strong>";
  } else {
    resDestaque.innerHTML = opcao.parcelas + "x de <strong>" + formatoReal.format(parcela) + "</strong>";
  }
  resTotal.textContent = formatoReal.format(total);
  resultado.hidden = false;

  // Link do WhatsApp com a simulação já escrita
  const descricao = opcao.parcelas === 1
    ? opcao.rotulo + " por " + formatoReal.format(total)
    : opcao.parcelas + "x de " + formatoReal.format(parcela) + " (total " + formatoReal.format(total) + ")";
  const msg =
    "Olá! Fiz uma simulação no site. Valor no Pix: " + formatoReal.format(valorPix) +
    ". Opção escolhida: " + descricao + ". Pode me ajudar?";
  btnWhats.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);

  // Tabela com todas as opções
  tabela.innerHTML = "";
  OPCOES.forEach((op, i) => {
    const c = calcular(valorPix, op);
    const linha = document.createElement("tr");
    if (i === indice) linha.className = "ativa";
    linha.innerHTML =
      "<td>" + op.rotulo + "</td>" +
      "<td>" + formatoReal.format(c.parcela) + "</td>" +
      "<td>" + formatoReal.format(c.total) + "</td>";
    tabela.appendChild(linha);
  });
  tabelaBox.hidden = false;
}

montarSelect();
campoValor.addEventListener("input", atualizar);
selectParcelas.addEventListener("change", atualizar);