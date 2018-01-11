
varying vec2 vUv;
varying vec2 uUv;

uniform sampler2D u_texture;
uniform float u_time;


void main()
{
	uUv = uv;
	vUv = uv;
	vUv.x *= 2.;
	vUv.y *= 2.;
	vUv.y += u_time*0.3;

	float h = texture2D( u_texture, vUv ).g * (1.-sin(uUv.x * 3.1416) + .2) * 500.  - sin(uUv.x * 3.1416) * 250.;


	vec3 p = vec3(position.x,h,position.z);

	vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}


