import argparse
import csv
import json
import os
import random

script_dir = os.path.dirname(os.path.abspath(__file__))

def get_owner_tickets(drop='000'):
  file_path = os.path.join(script_dir, f'tickets/{drop}.csv')
  owner_tickets = {}

  with open(file_path, 'r') as f:
    reader = csv.DictReader(f)

    for row in reader:
      tickets = int(row['tickets'])

      owner_tickets[row['address']] = {
        'address': row['address'],
        'tickets': tickets,
        'opepens': set(row['opepens'].split(', ')),
      }

    return owner_tickets

def get_ticket_ranges(owner_tickets):
  owners = {}
  last_range = 0

  for address, owner in owner_tickets.items():
    last_range += int(owner['tickets'])
    owners[address] = last_range

  return owners, last_range

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Manages Opepen drops')
  parser.add_argument('--seed', type=str, help='The block hash of the reveal transaction')
  parser.add_argument('--drop', type=str, help='The name of the drop (e.g. 000)')
  parser.add_argument('--sets', type=int, nargs='*', default=[1, 4, 5, 10, 20, 40], help='The sets in the drop')
  args = parser.parse_args()

  immutable_owner_tickets = get_owner_tickets(args.drop)
  owner_tickets = get_owner_tickets(args.drop)
  random.seed(args.seed)

  sets = []
  stats = {
    'winners': {}
  }

  for (draw_idx, set_size) in enumerate(args.sets):
    # Initialize the list of tokens in the drop
    sets.append({
      'set': set_size,
      'tokens': [],
    })

    for _ in range(0, set_size):
      ranges, total_tickets = get_ticket_ranges(owner_tickets)

      # Select random owner
      ticket_idx = random.randrange(total_tickets)
      owner = next(address for (address, idx) in ranges.items() if idx >= ticket_idx)

      # Select random token from owner
      available_tokens = list(owner_tickets[owner]['opepens'])
      available_tokens.sort()
      token = random.choice(available_tokens)

      # Store our set data
      sets[draw_idx]['tokens'].append(token)

      # Save some stats
      owner_data = immutable_owner_tickets[owner]
      stats['winners'].setdefault(owner, {
        'tickets': owner_data['tickets'],
      })
      stats['winners'][owner].setdefault('tokens', []).append({
        'set': set_size,
        'token': token,
      })

      # Remove the selection from the owner tickets dict
      owner_tickets[owner]['opepens'].remove(token)
      owner_tickets[owner]['tickets'] -= 1
      if (len(owner_tickets[owner]['opepens']) == 0):
        del owner_tickets[owner]

  # Save the result
  file_path = os.path.join(script_dir, f'results/{args.drop}.json')
  with open(file_path, 'w') as fp:
    json.dump(sets, fp, indent=2)

  file_path = os.path.join(script_dir, f'results/{args.drop}_stats.json')
  with open(file_path, 'w') as fp:
    json.dump(stats, fp, indent=2)
