import random
from helpers import (
  parse_arguments, get_owner_tickets, get_ticket_ranges,
  mark_token_as_used, compute_stats,
  save_collection, save_stats
)

# Get immutable owner tickets information and set constants
IMMUTABLE_OWNER_TICKETS = get_owner_tickets()
EDITION_SIZES = [1, 4, 5, 10, 20, 40]
ARGS = parse_arguments()

# Initialize our randomizer
random.seed(ARGS.seed)

# Distributes forced check tickets
def distribute_forced_check_tickets(owner_tickets, set_size, draw_idx, sets, stats):
  set_count_key = f'checks_original_{set_size}_count'
  # Filter owners with remaining forced checks
  forced = list(filter(lambda owner:owner[set_count_key] > 0, owner_tickets.values()))

  # Loop through owners with forced checks
  for owner in forced:
    for _ in range(owner[set_count_key]):
      # If no opepen left, continue
      if len(owner['opepens']) == 0: continue

      # Select first free opepen token
      token = sorted(owner['opepens'])[0]

      # Add to current set
      sets[draw_idx]['tokens'].append(token)

      # Save to stats, mark the tokens as used, and clear the current set check count
      compute_stats(stats, IMMUTABLE_OWNER_TICKETS[owner['address']], token, set_size)
      mark_token_as_used(owner_tickets, owner['address'], token)
      owner[set_count_key] -= 1

# Distributes tokens semi randomly based on ticket counts
def distribute_remaining_tokens(owner_tickets, set_size, draw_idx, sets, stats):
  number_of_tokens_in_set = set_size * 200
  remaining_tokens_count = number_of_tokens_in_set - len(sets[draw_idx]['tokens'])
  print(f'Tokens remaining after forced check-counts in {set_size}-set: {remaining_tokens_count}')

  # Loop through remaining tokens
  for _ in range(remaining_tokens_count):
    ranges, total_tickets = get_ticket_ranges(owner_tickets)

    # Select random ticket and its owner
    ticket_idx = random.randrange(total_tickets)
    address = next(address for (address, idx) in ranges.items() if idx >= ticket_idx)

    # Select random token from owner
    token = random.choice(sorted(owner_tickets[address]['opepens']))

    # Store our set data
    sets[draw_idx]['tokens'].append(token)

    # Save to stats and mark the token as used
    compute_stats(stats, IMMUTABLE_OWNER_TICKETS[address], token, set_size)
    mark_token_as_used(owner_tickets, address, token)

# Main function
def main():
  owner_tickets = get_owner_tickets()
  sets = []
  stats = {'winners': {}}

  # Create edition sets and distribute tokens
  for (draw_idx, set_size) in enumerate(EDITION_SIZES):
    sets.append({'set': set_size, 'tokens': []}) # Initialize the list of tokens in the drop
    distribute_forced_check_tickets(owner_tickets, set_size, draw_idx, sets, stats)
    distribute_remaining_tokens(owner_tickets, set_size, draw_idx, sets, stats)

  # Save collection and stats
  save_collection(sets)
  save_stats(stats)

  # Print result to verify total
  total_tokens = sum(len(s['tokens']) for s in sets)
  print(f'{total_tokens} tokens have been distributed')

if __name__ == '__main__': main()
