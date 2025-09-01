"""
Service for cataloging and filtering compatible automotive parts.
"""

import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test():
	return jsonify({"status": "ok", "message": "Backend is running!"})
import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/pecas/compatibilidade/<part_id>', methods=['GET'])
def compatibilidade(part_id):
	compatibles = get_compatible_parts(part_id)
	return jsonify({"compatibilidade": compatibles, "total": len(compatibles)})

"""
Service for cataloging and filtering compatible automotive parts.
"""

# Load parts from JSON file
def load_parts_db(json_path=None):
	if json_path is None:
		# Caminho absoluto para garantir leitura correta
		base_dir = os.path.dirname(os.path.abspath(__file__))
		json_path = os.path.join(base_dir, "parts_db.json")
	if not os.path.exists(json_path):
		return []
	with open(json_path, encoding="utf-8") as f:
		return json.load(f)

PARTS_DB = load_parts_db()


def get_part_by_id(part_id):
	for part in PARTS_DB:
		if part.get("id") == part_id:
			return part
	return None


def get_compatible_parts(part_id):
	original_part = get_part_by_id(part_id)
	if not original_part:
		return []
	original_category = original_part.get('category', '').lower()
	original_name = original_part.get('name', '').lower()

	original_part = get_part_by_id(part_id)
	if not original_part:
		return []
	original_category = original_part.get('category', '').lower()
	original_name = original_part.get('name', '').lower()

	compatible_parts = []
	for part in PARTS_DB:
		if part.get("id") == part_id:
			continue  # Skip the original part itself
		part_category = part.get('category', '').lower()
		part_name = part.get('name', '').lower()

		is_compatible = False
		if original_category == 'filtros':
			if 'óleo' in original_name and 'óleo' in part_name:
				is_compatible = True
			elif 'ar' in original_name and 'ar' in part_name:
				is_compatible = True
			elif (
				'óleo' not in original_name and
				'ar' not in original_name and
				'óleo' not in part_name and
				'ar' not in part_name
			):
				is_compatible = True
		else:
			if part_category == original_category:
				is_compatible = True

		if is_compatible:
			compatible_parts.append(part)
	return compatible_parts


# --- Flask API for frontend integration ---
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_unique(field):
	return sorted(list({str(part.get(field, "")) for part in PARTS_DB if part.get(field)}))

@app.route('/api/pecas/filtrar', methods=['POST'])
def filtrar_pecas():
	data = request.get_json(force=True)
	categoria = data.get('grupo', '').lower()
	peca = data.get('categoria', '').lower()
	marca = data.get('marca', '').lower()
	modelo = data.get('modelo', '').lower()
	ano = data.get('ano', '').lower()
	fabricante = data.get('fabricante', '').lower()
	# Se todos os filtros estiverem em branco, retorna vazio
	if not any([categoria, peca, marca, modelo, ano, fabricante]):
		return jsonify({
			"pecas": [],
			"total": 0,
			"mensagem": "Selecione ao menos um filtro para buscar peças."
		})

	def matches(part):
		# Filtra por categoria
		if categoria and part.get('category', '').lower() != categoria:
			return False
		# Filtra por nome da peça
		if peca and part.get('name', '').lower() != peca:
			return False
		# Filtra por fabricante
		if fabricante:
			if part.get('manufacturer', '').lower() != fabricante:
				return False
		# Filtra por marca/modelo/ano nos applications
		if marca or modelo or ano:
			apps = part.get('applications', [])
			found = False
			for app in apps:
				app_str = str(app).lower()
				# Marca
				if marca and marca not in app_str:
					continue
				# Modelo
				if modelo and modelo not in app_str:
					continue
				# Ano (intervalos)
				if ano:
					if ano != '':
						anos = []
						import re
						# String: extrai intervalos e anos
						if isinstance(app, str):
							matches = re.findall(r'\d{4}(?:-\d{4})?', app)
							for str_ano in matches:
								if '-' in str_ano:
									start, end = map(int, str_ano.split('-'))
									anos.extend([str(y) for y in range(start, end+1)])
								else:
									anos.append(str_ano)
						# Dict: array de anos
						elif isinstance(app, dict) and 'years' in app:
							for str_ano in app['years']:
								if isinstance(str_ano, str) and '-' in str_ano:
									start, end = map(int, str_ano.split('-'))
									anos.extend([str(y) for y in range(start, end+1)])
								else:
									anos.append(str(str_ano))
						if ano not in anos:
							continue
				found = True
				break
			if not found:
				return False
		return True

	filtered = [part for part in PARTS_DB if matches(part)]
	return jsonify({"pecas": filtered, "total": len(filtered)})

@app.route('/api/pecas/categorias', methods=['GET'])
def categorias():
	return jsonify({"categorias": get_unique('category')})

@app.route('/api/pecas/marcas', methods=['GET'])
def marcas():
	# Extract brands from applications
	brands = set()
	for part in PARTS_DB:
		for app in part.get('applications', []):
			if isinstance(app, str):
				brands.add(app.split()[0])
			elif isinstance(app, dict) and 'vehicle' in app:
				brands.add(app['vehicle'].split()[0])
	return jsonify({"marcas": sorted(list(brands))})


# Endpoint for vehicle models
@app.route('/api/pecas/modelos', methods=['GET'])
def modelos():
	modelos = set()
	for part in PARTS_DB:
		for app in part.get('applications', []):
			if isinstance(app, str):
				# Extract full model name (brand + model)
				tokens = app.split()
				if len(tokens) >= 2:
					# Assume last token(s) are year(s), so join all except last token if it's a year
					if tokens[-1].isdigit() and len(tokens[-1]) == 4:
						modelos.add(' '.join(tokens[:-1]))
					elif '-' in tokens[-1]:
						modelos.add(' '.join(tokens[:-1]))
					else:
						modelos.add(' '.join(tokens))
			elif isinstance(app, dict) and 'vehicle' in app:
				modelos.add(app['vehicle'])
	return jsonify({"modelos": sorted(list(modelos))})

# Improved endpoint for vehicle years
@app.route('/api/pecas/anos', methods=['GET'])
def anos():
	years = set()
	for part in PARTS_DB:
		for app in part.get('applications', []):
			if isinstance(app, str):
				# Extract years from strings like "Fiat Uno 2010-2015"
				import re
				found = re.findall(r'(\d{4})', app)
				years.update(found)
			elif isinstance(app, dict) and 'years' in app:
				years.update(str(y) for y in app['years'])
	return jsonify({"anos": sorted(list(years))})

@app.route('/api/pecas/fabricantes', methods=['GET'])
def fabricantes():
	return jsonify({"fabricantes": get_unique('manufacturer')})

if __name__ == "__main__":

	# Endpoint para retornar todas as peças
	@app.route('/api/pecas/todas', methods=['GET'])
	def todas_pecas():
		return jsonify({"pecas": PARTS_DB})

	app.run(debug=True, port=5000)
