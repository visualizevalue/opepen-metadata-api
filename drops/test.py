import csv
import os

file_name = 'tickets/000.csv'
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, file_name)

total_tickets = 0

with open(file_path, 'r') as file:
  csv_reader = csv.DictReader(file)

  for row in csv_reader:
    total_tickets += int(row['tickets'])

print(f'Total tickets: {total_tickets}')
