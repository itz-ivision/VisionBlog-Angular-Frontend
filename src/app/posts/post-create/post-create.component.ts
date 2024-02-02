import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import {mimeTypeValidator} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

  title= "";
  content = "";
  post!: Post;
  isLoading = false;
  postForm!: FormGroup;
  imagePreviewUrl!: string;
  private mode = 'create';
  private postId!: string | null;

  constructor(public postService: PostService, 
    public route: ActivatedRoute) {}

    ngOnInit() {
      this.postForm = new FormGroup({
        'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(7)] }),
        'image': new FormControl(null, { validators: [ Validators.required ], asyncValidators: [mimeTypeValidator]}),
        'content': new FormControl(null, { validators: [Validators.required] })
      });
    
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.postId = paramMap.get('postId');
        if (paramMap.has('postId') && this.postId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.postService.getPostById(this.postId).subscribe(
            (postData: any) => {
              this.isLoading = false;
              this.post = {
                _id: postData.data._id,
                title: postData.data.title,
                content: postData.data.content
              };
    
              this.postForm.setValue({
                'title': this.post.title,
                'content': this.post.content
              });
            },
            (error) => {
              // Handle error, if needed
              this.isLoading = false;
            }
          );
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }
    
    onFileChange(fileEvent: Event) {

      const inputElement = fileEvent.target as HTMLInputElement;
      const files = inputElement.files;
      
      if (files && files.length > 0) {
        const file = files[0];
        this.postForm.patchValue({ image: file });
        this.postForm.get('image')?.updateValueAndValidity();
        this.readAndDisplayImage(file);

      } else {
        console.log("No file selected");
      }

    }

    private readAndDisplayImage(file: File) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          const result = event.target.result;
          if (typeof result === 'string') {
            this.imagePreviewUrl = result;
          } else {
            console.error(" Unexpected result type : ", result)
          }
        }
      };

      reader.readAsDataURL(file);
    }

    onAddPost() {
      if (this.postForm.invalid) {
        alert('Please enter valid data to add post.');
        return;
      }
      this.isLoading = true;
      const { title: postTitle, content: postContent } = this.postForm.value;
  
      if (postTitle && postContent) {
        if (this.mode === 'create') {
          this.postService.addPost(postTitle, postContent);
        } else if (this.mode === 'edit' && this.postId) {
          this.postService.updatePostById(this.postId, postTitle, postContent);
        }
      }
  
      this.postForm.reset();
    }

  // getErrorMessage() {
  //   if(this.postTitle.hasError('required') && (this.postContent.hasError('required'))) {
  //     return "You must enter a valid value to add post."
  //   }
  // }

  getErrorMessage () {
    return "You must enter a valid title and content to add post."
  }

}
