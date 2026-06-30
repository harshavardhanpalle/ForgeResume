# Forge — Resume Builder (Frontend)

A static, multi-page frontend (no build step required) for a resume builder product. Built with plain HTML, CSS, and vanilla JS so it deploys identically across every target.

## Pages
- `index.html` — Home (hero with animated live-build preview, features, templates teaser, stats, CTA)
- `about.html` — About (mission, principles, team)
- `services.html` — Templates & Features (filterable template grid, scoring explanation)
- `contact.html` — Contact (validated form, no backend required — client-side only)
- `login.html` — Log in / Create account (tabbed UI, demo-only submit)

All pages include:
- Responsive navbar with mobile toggle
- Shared footer
- A floating **AI Co-pilot** chat widget (bottom-right) with canned, deterministic answers about resume writing — no external API calls, so it works with zero backend on every deployment target.

## Why plain HTML/CSS/JS (not React)?

Since this project is being deployed across EC2+Nginx, ECS, EKS, Elastic Beanstalk, Lambda, and CloudFront+S3, a static site with **no build step** means:
- Nginx can serve the folder as-is.
- S3 + CloudFront can serve the folder as-is.
- Lambda (with a tiny handler reading these files, or Lambda@Edge / Lambda Function URLs) can serve the folder as-is.
- ECS/EKS just need any container that serves static files (e.g. `nginx:alpine` with this folder copied in).
- Elastic Beanstalk can use its standard PHP or Node platform to host this directly, or its "static site" sample.

If you ever switch to React for a more advanced version, the same six deployment targets still apply — you'd just deploy the `npm run build` output (`/dist` or `/build`) instead of this folder directly.

## Quick local preview
```bash
cd forge-resume
python3 -m http.server 8080
# open http://localhost:8080
```

## Deployment notes per target

**1. EC2 + Nginx**
Copy this folder to `/var/www/forge` (or similar) on the instance, point Nginx's `root` at it, restart Nginx.

**2. Elastic Beanstalk**
Zip the contents of this folder (not the folder itself) and upload as a new application version on the PHP or Node static platform.

**3. ECS**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```
Build, push to ECR, run as an ECS service/task.

**4. EKS**
Use the same Docker image as ECS above, deploy as a Kubernetes Deployment + Service (and optionally an Ingress).

**5. Lambda**
Use a static-site Lambda adapter (e.g. AWS Lambda Web Adapter) with the same Nginx/Express setup, or front this folder with a Lambda Function URL + a thin static file handler.

**6. CloudFront + S3**
Upload all files to an S3 bucket with static website hosting enabled, point a CloudFront distribution at it, set `index.html` as the default root object.

## CI/CD (Jenkins / GitHub Actions)
Automate only #1 (EC2+Nginx) and #6 (CloudFront+S3) per your task list:
- **EC2+Nginx**: pipeline rsyncs/scp's this folder to the instance and reloads Nginx.
- **CloudFront+S3**: pipeline runs `aws s3 sync . s3://your-bucket --delete` then `aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"`.
