import random
from helpers import (
  parse_arguments, get_submissions, save_winners
)

EDITION_SIZES = [1, 4, 5, 10, 20, 40]
ARGS = parse_arguments()

# Initialize our randomizer
random.seed(ARGS.seed)

# Main function
def main():
  submissions = get_submissions(ARGS.set)

  winners = {size: set() for size in EDITION_SIZES}

  for edition_size in EDITION_SIZES:
    edition_submissions = list(filter(lambda s:s['edition'] == str(edition_size), submissions))
    opepens = set(map(int, map(lambda s:s['tokenId'], edition_submissions)))

    for _ in range(edition_size):
      token = random.choice(sorted(opepens))
      winners[edition_size].add(token)
      opepens.remove(token)

  save_winners(ARGS.set, winners)

if __name__ == '__main__': main()
