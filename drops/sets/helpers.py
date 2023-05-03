import argparse
import os
import json

def script_directory():
  return os.path.dirname(os.path.abspath(__file__))

def parse_arguments():
  parser = argparse.ArgumentParser(description='Manages Opepen drops')
  parser.add_argument('--seed', type=str, help='The block hash of the reveal transaction')
  parser.add_argument('--set', type=str, help='The set id')
  return parser.parse_args()

def get_submissions(set):
  file_path = os.path.join(script_directory(), f'data/{set}.json')

  with open(file_path, 'r', encoding='utf-8') as data:
    submissions = json.load(data)

  return submissions

def save_winners(set, winners):
  file_path = os.path.join(script_directory(), f'results/{set}.json')

  winners_lists = {key: list(value) for key, value in winners.items()}

  with open(file_path, 'w') as file:
    json.dump(winners_lists, file, indent=2)

