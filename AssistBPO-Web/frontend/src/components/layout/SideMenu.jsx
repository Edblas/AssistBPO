import React from 'react'

export function SideMenu({ setView, toggleDarkMode, dark }) {
  return (
    <div className="fixed top-20 right-4 w-44 bg-white dark:bg-gray-800 border rounded-md p-3 space-y-2 shadow z-40">
      <a
        href="https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes.aspx?id=21"
        target="_blank"
        rel="noreferrer"
        className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
      >
        Simples Nacional
      </a>
      <a
        href="https://grupometa-my.sharepoint.com/:o:/r/personal/mauricio_konig_meta_com_br/_layouts/15/Doc.aspx?sourcedoc=%7Bc25ac0fa-50eb-4c80-a819-1cd9d982f327%7D&action=view&wd=target(RENDA%20PJ.one%7C12361420-7a37-41e0-950d-97ea5c687924%2FSimples%20Nacional%7Ca5dbd916-a336-4e5f-a5ca-d4bc7bdb2fb9%2F)&wdorigin=NavigationUrl"
        target="_blank"
        rel="noreferrer"
        className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
      >
        Regramento Sicoob
      </a>

      <a
        href="https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp"
        target="_blank"
        rel="noreferrer"
        className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
      >
        Consultar CNPJ
      </a>

      <a
        href="https://wellingtn.github.io/ApoioBPO/"
        target="_blank"
        rel="noreferrer"
        className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
      >
        ApoioBPO
      </a>
    </div>
  )
}
