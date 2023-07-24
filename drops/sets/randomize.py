import random
from typing import Dict
from helpers import parse_arguments, get_submissions, save_winners

# Define available sizes and parse script arguments
EDITION_SIZES = [1, 4, 5, 10, 20, 40]
ARGS = parse_arguments()

# Initialize random seed for deterministic computation of random operations
random.seed(ARGS.seed)

# Get submission data for a given set
submissions = get_submissions(ARGS.set)

# Initialize dictionaries for quick access
# The opepen_signer dictionary maps token IDs to their respective signers.
# The signer_max_reveals dictionary maps signers to a nested dictionary that maps edition sizes to max reveal counts.
opepen_signer: Dict[int, str] = {
    int(submission['tokenId']): submission['signer'] for submission in submissions['opepens']
}
signer_max_reveals: Dict[str, Dict[str, int]] = submissions['maxReveals']


def track_max_reveals(token: int, edition_size: int, opepens: set[int]):
    """
    Keep track of and update the maximum reveals for a given token.

    Parameters:
    token (int): The ID of the token
    edition_size (int): The size of the edition
    opepens (set[int]): Set of available opepen token IDs

    The function decreases the maximum reveals for a given signer and edition size,
    and if we have reached the max amount of reveals, it removes all remaining opepen with the same signer.
    """
    signer = opepen_signer[token]
    edition_key = str(edition_size)
    max_reveals = signer_max_reveals.get(signer)

    if not max_reveals or max_reveals.get(edition_key) is None:
        return

    max_reveals[edition_key] -= 1

    if max_reveals[edition_key] == 0:
        remaining_opepen = {id for id in opepens if opepen_signer[id] == signer}
        opepens -= remaining_opepen


def main():
    """
    The main function that conducts the process of determining the winners.
    It follows these steps:
    1. It initializes the winners dictionary, which stores the winners for each edition size.
    2. For each edition size, it selects the opepens that match the current edition size.
    3. Then, it randomly picks winners until reaching the edition size, removing the chosen token each time.
    4. The winners and their corresponding edition sizes are then saved.
    """
    winners: Dict[int, set[int]] = {size: set() for size in EDITION_SIZES}

    for edition_size in EDITION_SIZES:
        edition_submissions = [
            submission for submission in submissions['opepens'] if submission['edition'] == str(edition_size)
        ]
        opepens = {int(submission['tokenId']) for submission in edition_submissions}

        for _ in range(edition_size):
            token = random.choice(sorted(opepens))
            winners[edition_size].add(token)
            opepens.remove(token)
            track_max_reveals(token, edition_size, opepens)

    save_winners(ARGS.set, winners)


# Execute the main function when called
if __name__ == '__main__':
    main()
