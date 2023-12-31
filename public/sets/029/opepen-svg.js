export const generateSvg = ({
  bg,
  dimension,
  fill,
  fillEyes,
  position,
  lookingLeft,
  positionIndicator
} = {
  bg: '#000',
  dimension: 512,
  fill: '#069420',
  fillEyes: false,
  position: 0, // 0 - 1
  positionIndicator: true,
  lookingLeft: true,
}) => `<svg width="${dimension}" height="${dimension}" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
  <rect fill="${bg}" width="8" height="8" />

  <g fill="${fillEyes ? 'black' : fill}" >
    <!-- Left Eye -->
    <g transform="translate(2, 2)">
      <path d="M 0 0
        L 1 0
        A 1 1, 0, 0, 1, 2 1
        L 0 1 Z"
      />
      <path d="M 1 1
        L 2 1
        A 1 1, 0, 0, 1, 1 2
        Z"
        fill="${fillEyes ? fill : lookingLeft ? 'white' : 'black'}"
      />
      <path d="M 1 1
        L 1 2
        A 1 1, 0, 0, 1, 0 1
        Z"
        fill="${fillEyes ? fill : lookingLeft ? 'black' : 'white'}"
      />
    </g>

    <!-- Right Eye -->
    <g transform="translate(4, 2)" id="right-eye">
      <path d="M 0 1
        L 2 1
        A 1 1, 0, 0, 0, 0 1
        Z"
      />
      <path d="M 1 1
        L 2 1
        A 1 1, 0, 0, 1, 1 2
        Z"
        fill="${fillEyes ? fill : lookingLeft ? 'white' : 'black'}"
      />
      <path d="M 1 1
        L 1 2
        A 1 1, 0, 0, 1, 0 1
        Z"
        fill="${fillEyes ? fill : lookingLeft ? 'black' : 'white'}"
      />
    </g>

    <!-- Mouth -->
    <g transform="translate(2, 4)">
      <path d="M 1 2
        A 1 1, 0, 0, 1, 0 1
        L 0 0
        L 4 0
        L 4 1
        A 1 1, 0, 0, 1, 3 2
        Z"
      />
    </g>
    <g stroke="${bg}" stroke-width="0.06">
      <line x1="2" x2="6" y1="5" y2="5" />
      ${ positionIndicator && `<circle r="0.12" cx="${2 + 4 * position}" cy="5" />` }
    </g>

    <!-- Torso -->
    <g transform="translate(2, 7)">
      <path d="M 0 1
        A 1 1, 0, 0, 1, 1 0
        L 3 0
        A 1 1, 0, 0, 1, 4 1
        L 0 1
        Z"
      />
    </g>
  </g>
</svg>`
