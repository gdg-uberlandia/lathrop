#!/bin/bash
# filepath: c:\Users\User\Documents\repos\lathrop\scripts\generate_env.sh

# Script para gerar arquivo .env a partir de string base64 do GitHub Actions
# Uso: ./generate_env.sh [BASE64_STRING]

set -e  # Parar execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar uso
show_usage() {
    echo -e "${BLUE}Uso:${NC}"
    echo -e "  ${GREEN}$0 [BASE64_STRING]${NC}"
    echo -e "  ${GREEN}$0 --from-github-secret SECRET_NAME${NC}"
    echo ""
    echo -e "${BLUE}Exemplos:${NC}"
    echo -e "  ${YELLOW}$0 'eyJORVhUX1BVQkxJQ19GSVJFQkFTRV9QUk9KRUNUX0lEIjoi...'${NC}"
    echo -e "  ${YELLOW}$0 --from-github-secret ENV_BASE64${NC}"
    echo ""
    echo -e "${BLUE}Variáveis de ambiente esperadas no GitHub Actions:${NC}"
    echo -e "  - ${GREEN}ENV_BASE64${NC}: String base64 com todas as variáveis"
    echo -e "  - ${GREEN}FB_CONFIG_BASE64${NC}: Config do Firebase em base64"
}

# Função para decodificar base64
decode_base64() {
    local base64_string="$1"
    
    if [[ -z "$base64_string" ]]; then
        echo -e "${RED}Erro: String base64 não fornecida${NC}"
        return 1
    fi
    
    # Tentar decodificar usando diferentes comandos dependendo do sistema
    if command -v base64 &> /dev/null; then
        echo "$base64_string" | base64 --decode 2>/dev/null || echo "$base64_string" | base64 -d 2>/dev/null
    elif command -v openssl &> /dev/null; then
        echo "$base64_string" | openssl base64 -d
    else
        echo -e "${RED}Erro: Nenhum comando de decodificação base64 encontrado${NC}"
        return 1
    fi
}

# Função para validar arquivo .env
validate_env_file() {
    local env_file="$1"
    
    if [[ ! -f "$env_file" ]]; then
        echo -e "${RED}Erro: Arquivo $env_file não foi criado${NC}"
        return 1
    fi
    
    # Verificar se contém variáveis essenciais do Firebase
    local required_vars=(
        "NEXT_PUBLIC_FB_PROJECT_ID"
        "FB_ADMIN_CLIENT_EMAIL"
        "FB_ADMIN_PRIVATE_KEY"
        "FB_ADMIN_DATABASE_URL"
    )
    
    echo -e "${BLUE}Validando variáveis essenciais...${NC}"
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" "$env_file"; then
            echo -e "  ✅ ${GREEN}$var${NC} encontrada"
        else
            echo -e "  ❌ ${RED}$var${NC} não encontrada"
        fi
    done
}

# Função para criar backup do .env.local existente
backup_existing_env() {
    local env_file=".env.local"
    
    if [[ -f "$env_file" ]]; then
        local backup_file="${env_file}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$env_file" "$backup_file"
        echo -e "${YELLOW}Backup criado: $backup_file${NC}"
    fi
}

# Função principal
main() {
    local base64_string=""
    local env_file=".env"
    
    # Verificar argumentos
    case "${1:-}" in
        -h|--help)
            show_usage
            exit 0
            ;;
        --from-github-secret)
            if [[ -z "$2" ]]; then
                echo -e "${RED}Erro: Nome do secret não fornecido${NC}"
                show_usage
                exit 1
            fi
            base64_string="${!2}"  # Pegar valor da variável de ambiente
            if [[ -z "$base64_string" ]]; then
                echo -e "${RED}Erro: Secret '$2' não encontrado nas variáveis de ambiente${NC}"
                exit 1
            fi
            ;;
        "")
            # Tentar pegar de variáveis de ambiente comuns
            if [[ -n "${ENV_BASE64:-}" ]]; then
                base64_string="$ENV_BASE64"
                echo -e "${BLUE}Usando ENV_BASE64 das variáveis de ambiente${NC}"
            elif [[ -n "${FB_CONFIG_BASE64:-}" ]]; then
                base64_string="$FB_CONFIG_BASE64"
                echo -e "${BLUE}Usando FB_CONFIG_BASE64 das variáveis de ambiente${NC}"
            else
                echo -e "${RED}Erro: Nenhuma string base64 fornecida${NC}"
                show_usage
                exit 1
            fi
            ;;
        *)
            base64_string="$1"
            ;;
    esac
    
    echo -e "${BLUE}🔧 Gerando arquivo .env ...${NC}"
    
    # Fazer backup do arquivo existente
    #backup_existing_env
    
    # Decodificar string base64
    echo -e "${BLUE}Decodificando string base64...${NC}"
    local decoded_content
    decoded_content=$(decode_base64 "$base64_string")
    
    if [[ $? -ne 0 ]] || [[ -z "$decoded_content" ]]; then
        echo -e "${RED}Erro: Falha ao decodificar string base64${NC}"
        exit 1
    fi
    
    # Escrever conteúdo no arquivo .env
    echo "$decoded_content" > "$env_file"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Arquivo $env_file criado com sucesso!${NC}"
        
        # Validar arquivo criado
        validate_env_file "$env_file"
        
        # Mostrar resumo
        local line_count=$(wc -l < "$env_file")
        echo -e "${BLUE}📊 Resumo:${NC}"
        echo -e "  - Arquivo: ${GREEN}$env_file${NC}"
        echo -e "  - Linhas: ${GREEN}$line_count${NC}"
        echo -e "  - Tamanho: ${GREEN}$(wc -c < "$env_file") bytes${NC}"
        
        # Verificar se é um ambiente de CI
        if [[ "${CI:-false}" == "true" ]]; then
            echo -e "${BLUE}🚀 Ambiente CI detectado${NC}"
            # Não mostrar conteúdo em CI por segurança
        else
            echo -e "\n${YELLOW}⚠️  Lembre-se de não committar o arquivo .env${NC}"
            echo -e "${YELLOW}⚠️  Adicione .env ao .gitignore se ainda não estiver${NC}"
        fi
        
    else
        echo -e "${RED}❌ Erro ao criar arquivo $env_file${NC}"
        exit 1
    fi
}

# Verificar se o script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi