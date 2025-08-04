// Exemplo de uso da ToolTip
import React from "react";
import ToolTip from "./index";

const ExemploToolTip = () => {
  return (
    <div
      style={{
        padding: "50px",
        display: "flex",
        gap: "20px",
        flexDirection: "column",
      }}
    >
      <h2>Exemplos de ToolTip</h2>

      {/* Uso básico */}
      <ToolTip content="Em breve" position="top">
        <button>Clique para ver tooltip (Top)</button>
      </ToolTip>

      {/* Diferentes posições */}
      <ToolTip content="Em breve" position="bottom">
        <button>Clique para ver tooltip (Bottom)</button>
      </ToolTip>

      <ToolTip content="Em breve" position="left">
        <button>Clique para ver tooltip (Left)</button>
      </ToolTip>

      <ToolTip content="Em breve" position="right">
        <button>Clique para ver tooltip (Right)</button>
      </ToolTip>

      {/* Com conteúdo customizado */}
      <ToolTip content="Funcionalidade em desenvolvimento" position="top">
        <span
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
        >
          Link desabilitado
        </span>
      </ToolTip>

      {/* Com elemento personalizado */}
      <ToolTip content="Em breve" position="top">
        <div
          style={{
            padding: "10px 20px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Card clicável
        </div>
      </ToolTip>
    </div>
  );
};

export default ExemploToolTip;
