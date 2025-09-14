import { useAuth } from "../../context/AuthContext";
import AdminLayout from "layouts/admin-layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "reactstrap";

function AdminIndex() {
  return (
    <Container>
      <div>
        <div>
          <h4>Conteúdo do Dashboard</h4>
          <p>Selecione uma opção acima para navegar.</p>
        </div>
      </div>
    </Container>
  );
}

AdminIndex.layout = AdminLayout;

export default AdminIndex;
