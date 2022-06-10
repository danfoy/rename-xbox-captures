# Xbox Captures Renamer

This script renames Xbox captures to be prefixed with an ISO datetime.

## Rationale

Clips captured on Xbox don't have standardized names:

- Clips uploaded and downloaded via OneDrive start with an Americanized date
- Clips captured to external storage devices are prefixed with the game name and an ISO-ordered date
- Hypernation is also different between the two

This script renames these files so that they all start with an ISO date, allowing them to be listed chronologically by filename within the filesystem. This is useful both for browing clips by date and for organizing them for importing into video editing software.

## Caveats

Only works on files that are currently available in the filesystem. Doesn't work on e.g. files which are available on iCloud but not downloaded.
