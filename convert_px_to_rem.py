#!/usr/bin/env python3
"""
Script para converter todos os valores em pixels (px) para rem em arquivos CSS.
Base: 1rem = 16px
"""
import os
import re
import glob

def convert_px_to_rem(css_content):
    """Converte valores em px para rem."""
    
    def px_to_rem_converter(match):
        px_value = float(match.group(1))
        rem_value = px_value / 16
        
        # Arredondar para 3 casas decimais máximo, remover zeros desnecessários
        if rem_value.is_integer():
            return f"{int(rem_value)}rem"
        else:
            return f"{rem_value:.3f}".rstrip('0').rstrip('.') + "rem"
    
    # Padrão para encontrar valores em px (números seguidos de "px")
    # Não converter valores em media queries ou comentários
    px_pattern = r'(?<![\w-])(\d+(?:\.\d+)?)px(?![\w-])'
    
    return re.sub(px_pattern, px_to_rem_converter, css_content)

def process_css_files():
    """Processa todos os arquivos CSS no projeto."""
    
    # Padrões de arquivos CSS
    css_patterns = [
        "src/**/*.css",
        "**/*.css"
    ]
    
    processed_files = []
    
    for pattern in css_patterns:
        for css_file in glob.glob(pattern, recursive=True):
            # Pular arquivos de node_modules e outros diretórios irrelevantes
            if any(skip in css_file for skip in ['node_modules', '.git', 'dist', 'build']):
                continue
                
            try:
                print(f"Processando: {css_file}")
                
                # Ler conteúdo do arquivo
                with open(css_file, 'r', encoding='utf-8') as f:
                    original_content = f.read()
                
                # Converter px para rem
                converted_content = convert_px_to_rem(original_content)
                
                # Verificar se houve mudanças
                if original_content != converted_content:
                    # Fazer backup do arquivo original
                    backup_file = css_file + '.backup'
                    with open(backup_file, 'w', encoding='utf-8') as f:
                        f.write(original_content)
                    
                    # Escrever conteúdo convertido
                    with open(css_file, 'w', encoding='utf-8') as f:
                        f.write(converted_content)
                    
                    processed_files.append(css_file)
                    print(f"✓ Convertido: {css_file}")
                else:
                    print(f"- Nenhuma conversão necessária: {css_file}")
                    
            except Exception as e:
                print(f"✗ Erro ao processar {css_file}: {e}")
    
    return processed_files

def main():
    """Função principal."""
    print("=== Conversão de PX para REM ===")
    print("Base: 1rem = 16px")
    print()
    
    # Mudar para o diretório do projeto
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    processed = process_css_files()
    
    print()
    print(f"=== RESUMO ===")
    print(f"Arquivos processados: {len(processed)}")
    
    if processed:
        print("Arquivos alterados:")
        for file in processed:
            print(f"  - {file}")
        print()
        print("Backups criados com extensão .backup")
    else:
        print("Nenhum arquivo foi alterado.")

if __name__ == "__main__":
    main()
