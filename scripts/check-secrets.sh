#!/usr/bin/env bash
# Проверка AC-27 / NFR-2: значения из .env.local не попали в git (индекс, рабочие
# файлы под контролем, история) и в сборку dist/.
# Печатает ТОЛЬКО имена переменных, файлов и коммитов и статусы FOUND/OK —
# сами значения никогда не выводятся. Exit 1 при любой находке.
set -euo pipefail

cd "$(dirname "$0")/.."
ENV_FILE=".env.local"
KEYS=(GREEN_API_ID_INSTANCE GREEN_API_TOKEN)
fail=0

# 1. .env.local и прочие .env* (кроме .env.example) должны игнорироваться и не быть в индексе.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if [ -e "$ENV_FILE" ] && ! git check-ignore -q "$ENV_FILE"; then
    echo "FOUND: $ENV_FILE не игнорируется git (.gitignore)"; fail=1
  fi
  tracked_env="$(git ls-files -- '.env*' ':!:.env.example' || true)"
  if [ -n "$tracked_env" ]; then
    echo "FOUND: в индексе git есть env-файлы:"; printf '  %s\n' $tracked_env; fail=1
  fi
else
  echo "WARN: не git-репозиторий — проверка индекса и истории пропущена"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "OK: $ENV_FILE нет — искать нечего (проверка .gitignore выполнена)"
  exit "$fail"
fi

# Читаем только нужные ключи, без source (файл не исполняем).
read_value() {
  local key="$1" line
  line="$(grep -E "^[[:space:]]*(export[[:space:]]+)?${key}=" "$ENV_FILE" | tail -n 1 || true)"
  line="${line#*=}"
  line="${line%$'\r'}"
  line="${line#\"}"; line="${line%\"}"
  line="${line#\'}"; line="${line%\'}"
  printf '%s' "$line"
}

for key in "${KEYS[@]}"; do
  value="$(read_value "$key")"
  if [ -z "$value" ]; then
    echo "SKIP: $key не задан в $ENV_FILE"
    continue
  fi
  if [ "${#value}" -lt 6 ]; then
    echo "SKIP: $key слишком короткий для надёжного поиска"
    continue
  fi
  hit=0

  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    # a) рабочая копия (отслеживаемые + новые неигнорируемые файлы) и индекс
    files="$(git grep --untracked -l -F -e "$value" -- . 2>/dev/null || true)"
    staged="$(git grep --cached -l -F -e "$value" -- . 2>/dev/null || true)"
    for f in $(printf "%s\n" $files $staged | sort -u); do echo "FOUND: $key в файле $f"; hit=1; done

    # b) вся история (все ветки и теги)
    if git rev-parse --verify -q HEAD >/dev/null 2>&1; then
      commits="$(git log --all --format=%h -S"$value" 2>/dev/null || true)"
      for c in $commits; do echo "FOUND: $key в истории, коммит $c"; hit=1; done
    fi
  fi

  # c) собранный бандл
  if [ -d dist ]; then
    dist_hits="$(grep -rl -F -e "$value" dist 2>/dev/null || true)"
    for f in $dist_hits; do echo "FOUND: $key в сборке $f"; hit=1; done
  fi

  if [ "$hit" -eq 0 ]; then echo "OK: $key — не найден (git, история, dist)"; else fail=1; fi
done

if [ "$fail" -eq 0 ]; then echo "check:secrets — OK"; else echo "check:secrets — FOUND (значения не печатаются)"; fi
exit "$fail"
