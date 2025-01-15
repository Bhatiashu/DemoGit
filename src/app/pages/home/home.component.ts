import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  data: any = {};
  firstname: string = '';
  lastname: string = '';
  dataService = inject(DataService);
  token: any;
  isAuthenticated = false;

  private jwtHelper = new JwtHelperService(); // Initialize JwtHelperService
  tokenCheckInterval: any;

  




  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router, private http: HttpClient,private fb: FormBuilder){}

  Data: any[] = [];
  currentPage = 1; // Start with page 1
  totalPages = 0; // To store total number of pages
  limit = 10; // Number of records per page
  
  searchParams = {
    firstname: '',
    mobile: '',
    startDate: '',
    endDate: '' ,
  };


  fetchData(params: any = {}) {
    

    const requestPayload = { ...params, page: this.currentPage, limit: this.limit }; // Include pagination details

    this.http.post('http://localhost:3000/api/data', requestPayload).subscribe({
      next: (response: any) => {
        console.log(response);
        this.Data = response.data; // Update the table data
        this.totalPages = response.totalPages; // Update total pages

      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }





  onSearch() {
    const { firstname, mobile, startDate, endDate } = this.searchParams;
    this.currentPage = 1; // Reset to first page when searching

    if (firstname) {
      // Search by first name
      this.fetchData({ firstname });
    } else if (mobile) {
      // Search by mobile number
      this.fetchData({ mobile });
    } else if (startDate && endDate) {
      // Search by date range
      this.fetchData({ startDate, endDate });
    } else {
      alert('Please enter at least one search criterion.');
    }
  }
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchData(this.searchParams); // Refetch the data for the new page
    }
  }

  // Go to the previous page
  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchData(this.searchParams); // Refetch the data for the new page
    }
  }





  








  // onSearch() {
  //   if (this.mobileSearchForm.valid) {
  //     this.mobileNumber = this.mobileSearchForm.value.mobile;
  //     console.log('Searching for mobile number:', this.mobileNumber);

  //     // Send HTTP request to backend to fetch data for the given mobile number
  //     this.http
  //       .post<any>('http://localhost:3000/fetch-data-by-mobile', {
  //         mobile: this.mobileNumber,
  //       })
  //       .subscribe({
  //         next: (response) => {
  //           console.log('Fetched data:', response);
  //           this.Data = response; // Assign fetched data to `data`
  //         },
  //         error: (err) => {
  //           console.error('Error fetching data:', err);
  //         },
  //       });
  //   } else {
  //     console.log('Invalid mobile number');
  //   }
  // }

  


  // fetchData() {
  //   const start = new Date(this.startDate + 'T00:00:00.000+00:00');
  //   const end = new Date(this.endDate + 'T23:59:59.999+00:00');
  //   const payload = { startDate: start.toISOString(), endDate: end.toISOString() };
  //   this.http.post<any[]>('http://localhost:3000/fetch-data', payload).subscribe({
  //     next: (response) => {
        
  //       console.log('Data received from server:', response); // Log server response
  //       this.Data = Object(response);

  //       // Dynamically generate columns from the first row of data
  //       if (this.Data.length > 0) {
  //         this.columns = Object.keys(this.Data[0]);
  //       } else {
  //         console.warn('No data received from server');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error while fetching data from server:', err); // Log errors
  //     },
  //   });
  // }


  

  




  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.data = this.dataService.getUserData();
      this.token = this.data?.token;
      if (this.token) {
        // Proceed with your logic if the token exists
        console.log('Token:', this.token);
      } else {
        // Handle the case where the token is missing
        console.error('No token found');
      }

      if (this.token && !this.jwtHelper.isTokenExpired(this.token)) {
        this.isAuthenticated = true;
      }else{
        this.router.navigate(['/login']);
      }

      this.firstname = this.data?.firstname;
      this.lastname = this.data?.lastname;
      
    } else {

    }
  }

  onLogout() {
    if(isPlatformBrowser(this.platformId)) {

    this.dataService.clearUserData();
    this.router.navigate(['/login']);
    }else{

    }
  }
}